'use client';

import type { Document } from '@/types/db';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SerializedEditorState } from 'lexical';
import debounce from 'lodash.debounce';

import AIPanel from '@/components/editor/ai-panel';
import MainEditor from '@/components/editor/main-editor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface PageContentProps {
  document: Document;
}

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Hello World 🚀',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

const PageContent = ({ document }: PageContentProps) => {
  const [editorState, setEditorState] = useState<SerializedEditorState>(
    document.content
      ? (JSON.parse(document.content) as unknown as SerializedEditorState)
      : initialValue,
  );

  const { mutate: saveDocument, isPending: isSaving } = useMutation({
    mutationFn: async (newContent: SerializedEditorState) => {
      await fetch(`/api/documents/${document.slug}/update-content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: JSON.stringify(newContent) }),
      });
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((content: SerializedEditorState) => {
      saveDocument(content);
    }, 1500),
    [],
  );

  const handleChange = (value: SerializedEditorState) => {
    setEditorState(value);
    debouncedSave(value);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full w-full">
          <MainEditor
            editorSerializedState={editorState}
            onSerializedChange={handleChange}
            isSaving={isSaving}
            document={document}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div>
          <AIPanel />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PageContent;
