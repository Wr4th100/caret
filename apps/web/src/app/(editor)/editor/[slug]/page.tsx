import type { Document } from '@/types/db';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import PageContent from '@/components/editor/page-content';
import { auth } from '@/lib/auth';

async function fetchDocument(slug: string): Promise<Document | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/documents/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      cookie: (await headers()).get('cookie') || '',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export default async function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log('session in page', session);

  const document = await fetchDocument(slug);

  console.log('document', document);

  if (!document) {
    return notFound();
  }

  return <PageContent document={document} />;
}
