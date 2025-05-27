import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@caret/db/client';

import { getActiveSession } from '@/actions/utils';

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching all chats for the user', req);
    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatsOfUser = await db.query.chat.findMany({
      where: (chat, { eq }) => eq(chat.userId, session.user.id),
      limit: 5,
      orderBy: (chat, { desc }) => desc(chat.createdAt),
    });

    const chats =
      chatsOfUser.map((chat) => ({
        id: chat.id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        userId: chat.userId,
        documentId: chat.documentId,
        title: chat.title,
        location: chat.location,
      })) ?? [];

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.log('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}
