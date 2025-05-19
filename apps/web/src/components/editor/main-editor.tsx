'use client';

import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SerializedEditorState } from 'lexical';
import debounce from 'lodash.debounce';

import { Editor } from '@/components/blocks/editor-00/editor';
import { Document } from '@/types/db';

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

type MainEditorProps = {
  document: Document;
};

export default function MainEditor({ document }: MainEditorProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState>(
    document.content
      ? (JSON.parse(document.content) as unknown as SerializedEditorState)
      : initialValue,
  );

  const { mutate: saveDocument } = useMutation({
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
    <div className="flex w-full">
      <Editor editorSerializedState={editorState} onSerializedChange={handleChange} />
    </div>
  );
}
