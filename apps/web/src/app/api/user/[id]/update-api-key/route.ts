import { NextResponse } from 'next/server';

import { eq } from '@caret/db';
import { db } from '@caret/db/client';
import { user } from '@caret/db/schema';

import { encrypt } from '@/lib/api-key';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    }

    const encryptedApiKey = encrypt(apiKey);

    const [updatedUser] = await db
      .update(user)
      .set({
        perplexityApiKey: encryptedApiKey,
      })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Failed to update API key.' }, { status: 500 });
  }
}
