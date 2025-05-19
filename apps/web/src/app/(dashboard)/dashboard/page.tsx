import { headers } from 'next/headers';

import CreateDocument from '@/components/dashboard/create-document';
import DocumentCard from '@/components/dashboard/document-card';
import { Document } from '@/types/db';

async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/documents/get-all`, {
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

export default async function DashboardPage() {
  const documents = await fetchDocuments();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Documents</h1>
          <p className="text-muted-foreground">
            Here you can view and manage all your documents. Click on a document to edit it.
          </p>
        </div>
        <div>
          <CreateDocument />
        </div>
      </div>
      <div>
        {documents.length === 0 ? (
          <p className="text-muted-foreground">No documents found.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {documents.map((document) => (
              <DocumentCard document={document} key={document.id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
