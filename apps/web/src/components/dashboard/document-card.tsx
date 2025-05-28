import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Document } from '@/types/db';

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <Link href={`/editor/${document.slug}`}>
      <Card className="w-full cursor-pointer transition-all hover:shadow-md hover:dark:border hover:dark:border-slate-700">
        <div className="flex flex-row items-center justify-between">
          <CardHeader className="w-full">
            <CardTitle className="flex flex-row items-center gap-2">
              <p>{document.name}</p>
              <Badge>{document.type.toLocaleUpperCase()}</Badge>
            </CardTitle>
            <CardDescription>{document.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex w-full flex-col items-end">
            <p className="text-muted-foreground text-sm">
              Last edited on {new Date(document.updatedAt).toLocaleString().toUpperCase()}
            </p>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default DocumentCard;
