'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, LexicalEditor } from 'lexical';
import { Cross, ShieldCheck, ShieldQuestion, ShieldX } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { removeCitationsFromText } from '@/lib/utils';

export const factCheckAction = async (selectedText: string) => {
  const res = await fetch('/api/ai/fact-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: selectedText }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Fact check failed');
  }
  const data = await res.json();
  console.log(data);
  // Example response: { verdict: "true" | "false" | "uncertain", source: "..." }
  const { text, sources } = data;
  const verdict = text.split(' ')[0].toLowerCase();

  return { verdict, text, sources };
};

export function FactCheckToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const factCheck = (editor: LexicalEditor) => {
    editor.read(async () => {
      const editorState = $getRoot().getTextContent();

      if (editorState !== '') {
        console.log('Fact checking editorState:', editorState);
        const selectedText = editorState.trim();

        toast.promise(factCheckAction(selectedText), {
          loading: 'Fact checking...',
          success: (result: {
            verdict: string;
            text: string;
            sources: { sourceType: string; url: string }[];
          }) => {
            console.log(result);
            return (
              <div className="flex items-center gap-2">
                <div>
                  {result.verdict.toLowerCase().includes('true') ? (
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                  ) : result.verdict.toLowerCase().includes('false') ? (
                    <ShieldX className="h-6 w-6 text-red-500" />
                  ) : (
                    <ShieldQuestion className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div>
                  <div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold">
                        Fact check result
                      </p>
                      <p>
                        <strong>{result.verdict.toUpperCase()}</strong>
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {removeCitationsFromText(result.text)}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
          error: (error: Error) => {
            return (
              <div className="flex items-center gap-2">
                <Cross className="h-4 w-4 text-red-500" />
                <span>Error: {error.message}</span>
              </div>
            );
          },
        });
      }
    });
  };

  return (
    <Button
      onClick={() => factCheck(editor)}
      aria-label="Fact Check"
      variant={'outline'}
      className="bg-linear-to-r from-cyan-700 via-blue-500 to-indigo-600"
    >
      <ShieldQuestion className="h-4 w-4" />
      <span>Fact Check</span>
    </Button>
  );
}
