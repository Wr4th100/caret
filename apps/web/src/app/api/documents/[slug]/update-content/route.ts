import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { eq } from '@caret/db';
import { db } from '@caret/db/client';
import { document } from '@caret/db/schema';

import { getActiveSession } from '@/actions/utils';

interface UpdateContentRequestBody {
  content: string;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = (await params).slug;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
    }

    const body = (await req.json()) as UpdateContentRequestBody;
    const content = body.content;

    const updatedDocument = await db
      .update(document)
      .set({
        content: content.toString(),
      })
      .where(eq(document.slug, slug))
      .returning();

    if (updatedDocument.length === 0) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedDocument[0]);
  } catch (error) {
    console.error('Error updating document content:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}
