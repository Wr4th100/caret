import type { Document } from '@/types/db';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import EditorHeader from '@/components/editor/editor-header';
import PageContent from '@/components/editor/page-content';

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

  const document = await fetchDocument(slug);

  if (!document) {
    return notFound();
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <EditorHeader document={document} />
      <PageContent document={document} />
    </div>
  );
}
