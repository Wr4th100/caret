'use server';

import { db } from '@caret/db/client';
import { message } from '@caret/db/schema';

import { getActiveSession } from '@/actions/utils';
import { Chat } from '@/types/db';

export async function createMessageAction({
  currentChat,
  content,
}: {
  currentChat: Chat;
  content: string;
}) {
  const session = await getActiveSession();

  if (!session || !session.user) {
    throw new Error('User not authenticated');
  }

  try {
    const [msg] = await db
      .insert(message)
      .values({
        chatId: currentChat.id,
        content,
        role: 'user',
      })
      .returning();
    if (!msg) {
      throw new Error('Message creation failed');
    }
    return msg;
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message');
  }
}
