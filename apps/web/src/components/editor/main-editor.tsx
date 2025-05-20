'use client';

// import { useQuery } from '@tanstack/react-query';
import { SerializedEditorState } from 'lexical';

import { Editor } from '@/components/blocks/editor-00/editor';
import { Document } from '@/types/db';

interface MainEditorProps {
  document: Document;
  editorSerializedState: SerializedEditorState;
  onSerializedChange: (newState: SerializedEditorState) => void;
  isSaving: boolean;
}

export default function MainEditor({
  document,
  editorSerializedState,
  onSerializedChange,
  isSaving,
}: MainEditorProps) {
  // TODO: Tanstack Query Implementation
  // const { data: document } = useQuery({
  //   queryKey: ['document', documentPrefetched.slug],
  //   queryFn: async () => {
  //     const response = await fetch(`/api/documents/${documentPrefetched.slug}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     return data;
  //   },
  //   initialData: {
  //     document: documentPrefetched,
  //   },
  // });

  return (
    <div className="flex w-full">
      <Editor
        document={document}
        editorSerializedState={editorSerializedState}
        onSerializedChange={onSerializedChange}
        isSaving={isSaving}
      />
    </div>
  );
}
