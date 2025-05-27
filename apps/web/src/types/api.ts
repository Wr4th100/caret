import { Chat, Message } from '@/types/db';

export interface ChatWithMessagesResponse {
  chat: Chat;
  messages: Message[];
}

export type AIInstruction =
  | {
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
    };
