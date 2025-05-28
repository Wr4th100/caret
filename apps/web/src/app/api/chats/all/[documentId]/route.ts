import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@caret/db/client';

import { getActiveSession } from '@/actions/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    console.log('Fetching all chats for the user', req);
    const documentId = Number((await params).documentId);

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    console.log('Document ID:', documentId);

    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatsOfUser = await db.query.chat.findMany({
      where: (chat, { eq, and }) =>
        and(eq(chat.userId, session.user.id), eq(chat.documentId, documentId)),
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
