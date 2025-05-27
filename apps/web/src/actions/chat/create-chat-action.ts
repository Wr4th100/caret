'use server';

import { db } from '@caret/db/client';
import { chat } from '@caret/db/schema';

export async function createChatAction({
  title,
  userId,
  documentId,
}: {
  title: string;
  userId: string;
  documentId: number;
}) {
  try {
    const newChat = await db
      .insert(chat)
      .values({
        userId,
        title,
        documentId,
      })
      .returning();

    if (newChat.length === 0) {
      throw new Error('Chat creation failed');
    }

    return newChat[0]!;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw new Error('Failed to create chat');
  }
}
