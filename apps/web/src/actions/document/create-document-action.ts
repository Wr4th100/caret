'use server';

import slugify from 'slugify';

import { db } from '@caret/db/client';
import { document } from '@caret/db/schema';

import { getActiveSession } from '@/actions/utils';

export async function createDocumentAction({
  name,
  description,
  type,
  authorId,
}: {
  name: string;
  description: string;
  type: string;
  authorId: string;
}) {
  const session = await getActiveSession();

  if (!session || !session.user) {
    throw new Error('User not authenticated');
  }

  try {
    const slug =
      slugify(name, {
        lower: true,
        strict: true,
      }) +
      '-' +
      Math.floor(Math.random() * 1000);

    const existingDocument = await db.query.document.findFirst({
      where: (document, { eq }) => eq(document.slug, slug),
    });

    if (existingDocument) {
      throw new Error('Document with this slug already exists');
    }

    const newDocument = await db
      .insert(document)
      .values({
        name,
        slug,
        description,
        type,
        authorId,
      })
      .returning();

    if (newDocument.length === 0) {
      throw new Error('Document creation failed');
    }

    return newDocument[0];
  } catch (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
}
