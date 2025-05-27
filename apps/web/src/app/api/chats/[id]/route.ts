import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@caret/db/client';

import { getActiveSession } from '@/actions/utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt((await params).id);

    if (!id) {
      return NextResponse.json({ error: 'Missing ID.' }, { status: 400 });
    }

    const chatWithMessages = await db.query.chat.findFirst({
      where: (chat, { eq }) => eq(chat.id, id),
      with: {
        messages: true,
      },
    });

    if (!chatWithMessages) {
      return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    }

    const chat = {
      id: chatWithMessages.id,
      createdAt: chatWithMessages.createdAt,
      updatedAt: chatWithMessages.updatedAt,
      userId: chatWithMessages.userId,
      documentId: chatWithMessages.documentId,
      title: chatWithMessages.title,
      location: chatWithMessages.location,
    };

    const messages = chatWithMessages.messages.map((message) => ({
      id: message.id,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      content: message.content,
      chatId: message.chatId,
      role: message.role,
    }));

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ chat, messages }, { status: 200 });
  } catch (error) {
    console.log('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}
