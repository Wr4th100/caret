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

    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
    }

    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}
