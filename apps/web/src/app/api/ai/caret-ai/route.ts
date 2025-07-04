import { createPerplexity } from '@ai-sdk/perplexity';
import { createDataStreamResponse, streamText } from 'ai';

import { eq } from '@caret/db';
import { db } from '@caret/db/client';
import { chat, message } from '@caret/db/schema';

import { getActiveSession } from '@/actions/utils';
import { incrementTrialUsage } from '@/lib/trial-limit';
import { Chat } from '@/types/db';
import { getUserApiKey } from '../utils';

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages: inputMessages,
    userPrompt,
    currentChat,
    editorState,
    documentId,
  } = (await req.json()) as {
    messages: { role: string; content: string }[];
    userPrompt: string;
    currentChat: Chat;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editorState: any; // Lexical editor state
    documentId: number;
  };

  console.log('Received request:', {
    inputMessages,
    userPrompt,
    currentChat,
    documentId,
    editorState,
  });

  const session = await getActiveSession();

  if (!session || !session.user) {
    throw new Error('User not authenticated');
  }

  let perplexityApiKey = await getUserApiKey(session.user.id);

  if (!perplexityApiKey) {
    // Use default Perplexity API key if not set and rate limit is not exceeded
    const trial = await incrementTrialUsage(session.user.id);

    if (!trial.allowed) {
      return new Response('Free trial limit exceeded. Please add your own API key or upgrade.', {
        status: 429,
      });
    }

    perplexityApiKey = process.env.DEFAULT_PERPLEXITY_API_KEY!;
  }

  console.log('Using Perplexity API Key:', perplexityApiKey);

  const perplexity = createPerplexity({
    apiKey: perplexityApiKey!,
  });

  const prompt = `
    You are an AI writing assistant integrated into a structured document editor like Lexical. 
    The document content is composed of rich, typed nodes such as paragraphs, quotes, headings, and code blocks.

    ---
    USER INSTRUCTION:
    ${userPrompt}

    Below is the current document structure and content. Based on the user’s instruction, return an updated version of the changed section or a new node suggestion.
    You can also give a list of instructions to edit the document, such as replacing text, inserting new nodes, or modifying existing ones.
    The AI Instruction should be enclosed in JSON markdown (three backticks and json).

    ---
    DOCUMENT:
    ${JSON.stringify(editorState)}

    ---
    RESPONSE FORMAT:
    type AIInstruction =
      ({
          type: 'edit';
          targetIndex: number;
          newContent: string; // replaces content in block
          language?: string; // optional, for code blocks
        }
      | {
          type: 'insert';
          position: 'above' | 'below';
          targetIndex: number;
          nodeType: 'paragraph' | 'heading' | 'quote' | 'code';
          content: string;
          language?: string; // optional, for code blocks
      })[]
  `;

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData('Initialized Call');
      let fullContent = '';
      console.log('Prompt', prompt);
      const result = streamText({
        model: perplexity('sonar'),
        prompt,
        // messages: inputMessages,
        onChunk({ chunk }) {
          dataStream.writeData(chunk);
          console.log('CHUNK', chunk);
        },
        async onFinish({ text, usage, toolResults, sources }) {
          fullContent = text;
          console.log('TEXT', text);
          console.log('TOOL RESULTS', toolResults);
          console.log('USAGE', usage);
          console.log('SOURCES', sources);

          queueMicrotask(async () => {
            try {
              console.log('Running background DB task...', currentChat);
              const [msg] = await db
                .insert(message)
                .values({
                  chatId: currentChat.id,
                  content: fullContent,
                  role: 'ai',
                  webLinks: sources.map((s) => s.url),
                })
                .returning();

              if (currentChat.title === 'New Chat') {
                await db
                  .update(chat)
                  .set({
                    title: fullContent.slice(0, 50),
                  })
                  .where(eq(chat.id, currentChat.id));
              }
              console.log('Message saved:', msg);
            } catch (err) {
              console.error('Background DB error:', err);
            }
          });

          sources.map((source) => {
            dataStream.writeSource(source);
          });
        },
      });
      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}
