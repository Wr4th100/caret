import { JSX, useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isAtNodeEnd } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  BaseSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
  NodeKey,
} from 'lexical';

import { useAITabContext } from '@/components/editor/context/ai-tab-context';
import { $createAITabNode, AITabNode } from '@/components/editor/nodes/ai-tab-node';
import { addSwipeRightListener } from '@/components/editor/utils/swipe';

const SYSTEM_PROMPT = `
This is the document content: 

{{documentContent}}

You are a helpful assistant. 
You should behave like what Copilot does. 
With the letters I give you, you should give me the best possible auto completion. 
For example, if I give you resp, you should give me response or responsibility (depending on the context)
Basically, you should give me the best possible word that I can use in my text.
Only return the word that is needed. Do not add any comments or explanations.
Do not add any extra text.
`;

type SearchPromise = {
  dismiss: () => void;
  promise: Promise<null | string>;
};

const suggestionCache = new Map<string, string>();

export const uuid = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 5);

function $search(selection: null | BaseSelection): [boolean, string] {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return [false, ''];
  }
  const node = selection.getNodes()[0];
  const anchor = selection.anchor;
  // Check siblings?
  if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
    return [false, ''];
  }
  const word = [];
  const text = node.getTextContent();
  let i = node.getTextContentSize();
  let c;
  while (i-- && i >= 0 && (c = text[i]) !== ' ') {
    word.push(c);
  }
  if (word.length === 0) {
    return [false, ''];
  }
  return [true, word.reverse().join('')];
}

function useQuery(): (searchText: string, documentContent: string) => SearchPromise {
  return useCallback((searchText: string, documentContent: string) => {
    const server = new AITabServer();
    console.time('query');
    const response = server.query(searchText, documentContent);
    console.timeEnd('query');
    return response;
  }, []);
}

export function AITabPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [, setSuggestion] = useAITabContext();
  const query = useQuery();

  useEffect(() => {
    let aiTabNodeKey: NodeKey | null = null;
    let searchPromise: null | SearchPromise = null;
    let lastSuggestion: null | string = null;
    let lastMatch: null | string = null;
    let debounceTimer: NodeJS.Timeout | null = null;

    function $clearSuggestion() {
      const aiTabNode = aiTabNodeKey !== null ? $getNodeByKey(aiTabNodeKey) : null;
      if (aiTabNode !== null && aiTabNode.isAttached()) {
        aiTabNode.remove();
        aiTabNodeKey = null;
      }
      if (searchPromise !== null) {
        searchPromise.dismiss();
        searchPromise = null;
      }
      lastMatch = null;
      lastSuggestion = null;
      setSuggestion(null);
    }
    function updateAsyncSuggestion(refSearchPromise: SearchPromise, newSuggestion: null | string) {
      if (searchPromise !== refSearchPromise || newSuggestion === null) {
        // Outdated or no suggestion
        return;
      }
      editor.update(
        () => {
          const selection = $getSelection();
          const [hasMatch, match] = $search(selection);
          if (!hasMatch || match !== lastMatch || !$isRangeSelection(selection)) {
            // Outdated
            return;
          }
          const selectionCopy = selection.clone();
          const node = $createAITabNode(uuid);
          aiTabNodeKey = node.getKey();
          selection.insertNodes([node]);
          $setSelection(selectionCopy);
          lastSuggestion = newSuggestion;
          setSuggestion(newSuggestion);
        },
        { tag: 'history-merge' },
      );
    }
    function handleUpdate() {
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        editor.update(() => {
          const content = JSON.stringify(editor.getEditorState());
          const selection = $getSelection();
          const [hasMatch, match] = $search(selection);
          if (!hasMatch) {
            $clearSuggestion();
            return;
          }
          if (match === lastMatch) {
            return;
          }
          $clearSuggestion();
          searchPromise = query(match, content);
          searchPromise.promise
            .then((newSuggestion) => {
              if (searchPromise !== null) {
                updateAsyncSuggestion(searchPromise, newSuggestion);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((e) => {
              // console.error(e)
            });
          lastMatch = match;
        });
      }, 400);
    }
    function $handleAITabNodeTransform(node: AITabNode) {
      const key = node.getKey();
      if (node.__uuid === uuid && key !== aiTabNodeKey) {
        // Max one Autocomplete node per session
        $clearSuggestion();
      }
    }
    function $handleAutocompleteIntent(): boolean {
      if (lastSuggestion === null || aiTabNodeKey === null) {
        return false;
      }
      const autocompleteNode = $getNodeByKey(aiTabNodeKey);
      if (autocompleteNode === null) {
        return false;
      }
      const textNode = $createTextNode(lastSuggestion);
      autocompleteNode.replace(textNode);
      textNode.selectNext();
      $clearSuggestion();
      return true;
    }
    function $handleKeypressCommand(e: Event) {
      if ($handleAutocompleteIntent()) {
        e.preventDefault();
        return true;
      }
      return false;
    }
    function handleSwipeRight(_force: number, e: TouchEvent) {
      editor.update(() => {
        if ($handleAutocompleteIntent()) {
          e.preventDefault();
        }
      });
    }
    function unmountSuggestion() {
      editor.update(() => {
        $clearSuggestion();
      });
    }

    const rootElem = editor.getRootElement();

    return mergeRegister(
      editor.registerNodeTransform(AITabNode, $handleAITabNodeTransform),
      editor.registerUpdateListener(handleUpdate),
      editor.registerCommand(KEY_TAB_COMMAND, $handleKeypressCommand, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, $handleKeypressCommand, COMMAND_PRIORITY_LOW),
      ...(rootElem !== null ? [addSwipeRightListener(rootElem, handleSwipeRight)] : []),
      unmountSuggestion,
    );
  }, [editor, query, setSuggestion]);

  return null;
}

class AITabServer {
  LATENCY = 200;

  query(searchText: string, documentContent: string): SearchPromise {
    let isDismissed = false;

    if (suggestionCache.has(searchText)) {
      return {
        promise: Promise.resolve(suggestionCache.get(searchText) ?? null),
        dismiss: () => {},
      };
    }

    const dismiss = () => {
      isDismissed = true;
    };

    const promise: Promise<null | string> = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isDismissed) {
          // TODO cache result
          return reject('Dismissed');
        }
        const searchTextLength = searchText.length;
        if (searchText === '' || searchTextLength < 4) {
          return resolve(null);
        }

        if (searchTextLength > 100) {
          return reject('Too long');
        }

        const aiTabResult = await fetch('/api/ai/tab', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: searchText,
            system: SYSTEM_PROMPT.replace(
              '{{documentContent}}',
              documentContent.replace(/\\n/g, '\n'),
            ),
            model: 'gpt-4o-mini',
          }),
        });

        console.log('AI Tab Result', aiTabResult);

        if (!aiTabResult.ok) {
          return reject('Failed to fetch');
        }

        const result = await aiTabResult.json();
        console.log('AI Tab Result JSON', result);
        const resultText = result.text;
        if (resultText === undefined) {
          return reject('No result');
        }
        const finalChunk = (resultText as string).substring(searchTextLength);
        suggestionCache.set(searchText, finalChunk);
        if (finalChunk.length > 0) {
          return resolve(finalChunk);
        }
        return reject('No result');
      }, this.LATENCY);
    });

    return {
      promise,
      dismiss,
    };
  }
}
