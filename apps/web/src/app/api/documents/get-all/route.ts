import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@caret/db/client';

import { getActiveSession } from '@/actions/utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await db.query.document.findMany({
      where: (document, { eq }) => eq(document.authorId, session.user.id),
    });

    if (!documents) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}
