import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { eq } from '@caret/db';
import { db } from '@caret/db/client';
import { document } from '@caret/db/schema';

interface UpdateContentRequestBody {
  content: string;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const cookie = req.headers.get('cookie');
    console.log('cookie', cookie);

    const slug = (await params).slug;
    console.log('IN API', slug);

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
    }

    const body = (await req.json()) as UpdateContentRequestBody;
    const content = body.content;
    console.log('content', content, typeof content);

    const updatedDocument = await db
      .update(document)
      .set({
        content: content.toString(),
      })
      .where(eq(document.slug, slug))
      .returning();

    console.log('updatedDocument', updatedDocument);

    if (updatedDocument.length === 0) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedDocument[0]);
  } catch (error) {
    console.error('Error updating document content:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}
