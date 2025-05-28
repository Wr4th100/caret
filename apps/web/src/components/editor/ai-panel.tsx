'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon, Paperclip, Plus, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { createChatAction } from '@/actions/chat/create-chat-action';
import { createMessageAction } from '@/actions/chat/create-message-action';
import LoadingScreen from '@/app/loading';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { authClient } from '@/lib/auth-client';
import { applyAIInstruction } from '@/lib/editor-utils';
import { cn } from '@/lib/utils';
import { AIInstruction } from '@/types/api';
import { Chat, Document } from '@/types/db';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: Source[];
}

interface Source {
  sourceType: string;
  id: string;
  url: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LexicalEdit = {
  action: 'replace' | 'insertAfter' | 'delete';
  path: number[]; // e.g., [0] means root.children[0], or [0, 1] for nested
  content?: object; // raw Lexical JSON node(s)
};

interface ChatWithMessagesResponse {
  chat: Chat;
  messages: Message[];
}

const AIPanel = ({ document }: { document: Document }) => {
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const [editor] = useLexicalComposerContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    isPending,
    error,
    data: allChatsData,
    refetch,
  } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('/api/chats/all').then((res) => {
        console.log('High');
        return res.json() as Promise<{ chats: Chat[] }>;
      }),
  });

  console.log('All chats data:', allChatsData);

  const handleSubmit = (e: React.FormEvent, currentChat: Chat) => {
    e.preventDefault();
    if (input.trim()) {
      console.log('Submitting input:', input, 'for chat:', currentChat);
      handlePromptSubmit(input, currentChat);
      setInput('');
    }
  };

  const handlePromptSubmit = useCallback(
    async (input: string, chat: Chat) => {
      const state = editor.getEditorState().toJSON();
      console.log('Editor state:', JSON.stringify(state, null, 2));
      const id = crypto.randomUUID();

      setIsStreaming(true);

      console.log('Chat', chat);

      const res = await fetch('/api/ai/caret-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          editorState: state,
          documentId: document.id,
          currentChat: chat,
          userPrompt: input,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';
      let ndjson = '';
      const sources: Source[] = [];
      let finalMsg: Message | null = null;
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // save ndjson to a variable
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ndjson += chunk;

        for (const line of chunk.split('\n')) {
          if (line.startsWith('0:')) {
            try {
              const json = JSON.parse(line.slice(2));
              content += json;
              const partialMsg: Message = {
                id: id + '-ai',
                role: 'ai',
                content,
              };
              setMessages((prev) => [...prev.filter((m) => m.id !== partialMsg.id), partialMsg]);
            } catch (e) {
              console.warn('Failed to parse chunk line:', line, e);
            }
          } else if (line.startsWith('data:')) {
            console.log('Metadata');
          } else if (line.startsWith('h:')) {
            const source = JSON.parse(line.slice(2)) as Source;
            sources.push(source);
          }
        }

        // add the sources to the message
        finalMsg = {
          id: id + '-ai',
          role: 'ai',
          content,
          sources,
        };
        if (!finalMsg) {
          console.warn('Final message is null, skipping update');
          return;
        }
        setMessages((prev) => [...prev.filter((m) => finalMsg && m.id !== finalMsg.id), finalMsg!]);
      }

      console.log('Final message:', finalMsg);

      // Take the section from content which is enclosed in ```json .... ```
      const edits = finalMsg?.content.match(/```json\n([\s\S]*?)\n```/)?.[1];
      if (!edits) {
        console.warn('No edits found in final message content');
        setIsStreaming(false);
        return;
      }

      const instructions = JSON.parse(edits) as AIInstruction[];

      applyAIInstruction(editor, instructions);

      setIsStreaming(false);

      // if this is the first message in the chat, set the chat title
      if (chat.title === 'New Chat') {
        await refetch();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, messages],
  );

  // 🔽 Scroll to bottom on new message
  useEffect(() => {
    console.log('useEffect: messages changed', messages);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // useEffect(() => {
  //   let debounceTimer: NodeJS.Timeout | null = null;
  //   function handleUpdate() {
  //     if (debounceTimer) clearTimeout(debounceTimer);

  //     debounceTimer = setTimeout(() => {
  //       editor.update(() => {
  //         const selection = $getSelection();
  //         const state = editor.getEditorState().toJSON();

  //         console.log('Editor state:', JSON.stringify(state, null, 2));
  //         console.log('SELECTION OOOH', selection);
  //       });
  //     }, 400);
  //   }
  //   editor.registerUpdateListener(() => {
  //     handleUpdate();
  //   });
  // }, [editor]);

  useEffect(() => {
    console.log('useEffect: allChatsData', allChatsData);
    if (!session) {
      return;
    }
    if (allChatsData?.chats && allChatsData.chats.length > 0) {
      const chat = allChatsData.chats[0]; // Assuming you want the first chat
      console.log('Selected chat:', chat);
      setChat(chat!);
      console.log('Setting chat", chat:', chat);
    }
  }, [session, allChatsData, document.id]);

  useEffect(() => {
    console.log('useEffect: chat changed', chat);
    if (!chat) return;

    // Fetch messages for the selected chat
    const fetchMessages = async () => {
      const response = await fetch(`/api/chats/${chat.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }
      const data = (await response.json()) as ChatWithMessagesResponse;
      // setChatMessages(data.messages);
      console.log('Fetched messages:', data.messages);
      setMessages(data.messages);
    };

    fetchMessages();
  }, [chat]);

  if (isAuthPending || isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    console.error('Error fetching chats:', error);
    return <p className="text-red-500">Failed to load chats</p>;
  }

  return (
    <div className="relative flex h-full w-full flex-1 flex-col gap-2">
      <div className="flex flex-row items-center justify-between border-b p-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <p className="text-primary font-medium tracking-tighter">Caret AI</p>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-1 p-1"
                  disabled={allChatsData?.chats.length === 0}
                >
                  {chat ? (
                    <p>{chat.title + '...' || 'New Chat'}</p>
                  ) : (
                    <span className="text-muted-foreground">New Chat</span>
                  )}
                  {allChatsData?.chats.length !== 0 && <ChevronDownIcon className="h-4 w-4" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {allChatsData?.chats.map((chat) => (
                    <DropdownMenuItem
                      key={chat.id}
                      onClick={() => {
                        setChat(chat);
                        setMessages([]);
                      }}
                    >
                      {chat.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={async () => {
            if (!session) {
              throw new Error('Session not found');
            }
            const newChat = await createChatAction({
              title: 'New Chat',
              userId: session.user.id,
              documentId: document.id,
            });
            console.log('New chat created:', newChat);
            setChat(newChat);
            setMessages([]);
          }}
        >
          <Plus />
          <span className="ml-1">New Chat</span>
        </Button>
      </div>
      <div className="h-[840px] space-y-4 overflow-y-scroll px-2 pt-0 pb-20">
        {messages.length !== 0 ? (
          <div className="flex justify-center">{/* {TODO} */}</div>
        ) : (
          <div className="mt-4 flex justify-center">
            <p className="text-muted-foreground">Start a chat with CaretAI</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-full flex-col gap-1 overflow-x-auto rounded-lg p-2 shadow ${
                message.role === 'user'
                  ? 'bg-primary text-background items-end rounded-br-none'
                  : 'bg-secondary items-start rounded-bl-none'
              }`}
            >
              <Badge
                className={cn(`text-xs`, message.role === 'user' ? 'justify-end' : 'justify-start')}
                variant={message.role === 'user' ? 'secondary' : 'default'}
              >
                {message.role === 'user' ? 'You' : 'AI'}
              </Badge>
              <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeSanitize, rehypeHighlight, rehypeKatex]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {/* <span className="mt-1 block text-right text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span> */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 rounded-lg border p-2 shadow-sm">
                  <p className="text-xs font-semibold">Sources:</p>

                  {message.sources.map((source) => (
                    <Link
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      {source.url}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="bg-background absolute right-0 bottom-0 flex w-full border-t p-2">
        <div className="flex w-full space-x-2">
          <div className="relative flex-1">
            <form>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI... /summarize /continue"
                className="pr-10"
                onKeyDown={async (e) => {
                  console.log('Key pressed:', e.key);
                  if (!session) {
                    throw new Error('Session not found');
                  }
                  if (e.key === 'Enter' && !(e.shiftKey || e.metaKey)) {
                    console.log('Enter pressed, submitting input:', input);
                    if (!chat) {
                      const newChat = await createChatAction({
                        title: 'New Chat',
                        userId: session.user.id,
                        documentId: document.id,
                      });
                      const message = await createMessageAction({
                        currentChat: newChat,
                        content: input,
                      });
                      console.log('New chat created:', newChat);
                      console.log('Message created:', message);
                      setChat(newChat);
                      setMessages((prev) => [
                        ...prev,
                        {
                          ...message,
                          id: message.id.toString(),
                          role: message.role as 'user' | 'ai',
                          sources: [],
                        },
                      ]);
                      handleSubmit(e, newChat);
                    } else {
                      const message = await createMessageAction({
                        currentChat: chat,
                        content: input,
                      });
                      setMessages((prev) => [
                        ...prev,
                        {
                          ...message,
                          id: message.id.toString(),
                          role: message.role as 'user' | 'ai',
                          sources: [],
                        },
                      ]);
                      handleSubmit(e, chat);
                    }
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-8 h-8 w-8 rounded-full"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant={'ghost'}
                // onClick={handleSend}
                size="icon"
                className="absolute top-1 right-1 h-8 w-8 rounded-full"
                disabled={isStreaming}
                onClick={async (e) => {
                  if (!session) {
                    throw new Error('Session not found');
                  }
                  if (!chat) {
                    const newChat = await createChatAction({
                      title: 'New Chat',
                      userId: session.user.id,
                      documentId: document.id,
                    });
                    const message = await createMessageAction({
                      currentChat: newChat,
                      content: input,
                    });
                    console.log('New chat created:', newChat);
                    console.log('Message created:', message);
                    setChat(newChat);
                    setMessages((prev) => [
                      ...prev,
                      {
                        ...message,
                        id: message.id.toString(),
                        role: message.role as 'user' | 'ai',
                        sources: [],
                      },
                    ]);
                    handleSubmit(e, newChat);
                  } else {
                    console.log('Handling submit for existing chat:', chat);
                    const message = await createMessageAction({
                      currentChat: chat,
                      content: input,
                    });
                    setMessages((prev) => [
                      ...prev,
                      {
                        ...message,
                        id: message.id.toString(),
                        role: message.role as 'user' | 'ai',
                        sources: [],
                      },
                    ]);
                    handleSubmit(e, chat);
                  }
                }}
              >
                {isStreaming ? '...' : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
