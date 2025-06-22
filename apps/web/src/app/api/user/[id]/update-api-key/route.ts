import { eq } from '@caret/db';
import { db } from '@caret/db/client';
import { user } from '@caret/db/schema';

import { encrypt } from '@/lib/api-key';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing user ID.' }), { status: 400 });
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required.' }), { status: 400 });
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
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return new Response(JSON.stringify({ error: 'Failed to update API key' }), { status: 500 });
  }
}
