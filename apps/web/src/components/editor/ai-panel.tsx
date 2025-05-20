'use client';

import { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const AIPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hello! How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      content: 'Tell me a joke.',
      sender: 'user',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 3,
      content: "Why don't scientists trust atoms? Because they make up everything!",
      sender: 'ai',
      timestamp: new Date(Date.now() - 1700000).toISOString(),
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content:
          'This is a simulated response. In a real app, you would connect to your AI backend here.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
  };
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col gap-2">
      <div className="p-2">
        <p className="text-primary font-medium tracking-tighter">Caret AI</p>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-xs flex-col gap-1 rounded-lg p-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-background items-end rounded-br-none'
                    : 'bg-secondary items-start rounded-bl-none'
                }`}
              >
                <Badge
                  className={cn(
                    `text-xs`,
                    message.sender === 'user' ? 'justify-end' : 'justify-start',
                  )}
                  variant={message.sender === 'user' ? 'secondary' : 'default'}
                >
                  {message.sender === 'user' ? 'You' : 'AI'}
                </Badge>
                <p className="text-sm">{message.content}</p>
                <span className="mt-1 block text-right text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-2">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="rounded-full pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
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
              onClick={handleSend}
              size="icon"
              className="absolute top-1 right-1 h-8 w-8 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
