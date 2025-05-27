'use client';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { EditorState, ParagraphNode, SerializedEditorState, TextNode } from 'lexical';

import { AiTabContext } from '@/components/editor/context/ai-tab-context';
import { FloatingLinkContext } from '@/components/editor/context/floating-link-context';
import { AITabNode } from '@/components/editor/nodes/ai-tab-node';
// import { SharedAutocompleteContext } from '@/components/editor/context/shared-autocomplete-context';
// import { AutocompleteNode } from '@/components/editor/nodes/autocomplete-node';
import { CollapsibleContainerNode } from '@/components/editor/nodes/collapsible-container-node';
import { CollapsibleContentNode } from '@/components/editor/nodes/collapsible-content-node';
import { CollapsibleTitleNode } from '@/components/editor/nodes/collapsible-title-node';
import { FigmaNode } from '@/components/editor/nodes/embeds/figma-node';
import { TweetNode } from '@/components/editor/nodes/embeds/tweet-node';
import { YouTubeNode } from '@/components/editor/nodes/embeds/youtube-node';
import { EmojiNode } from '@/components/editor/nodes/emoji-node';
import { EquationNode } from '@/components/editor/nodes/equation-node';
import { ExcalidrawNode } from '@/components/editor/nodes/excalidraw-node';
import { ImageNode } from '@/components/editor/nodes/image-node';
import { InlineImageNode } from '@/components/editor/nodes/inline-image-node';
import { KeywordNode } from '@/components/editor/nodes/keyword-node';
import { PageBreakNode } from '@/components/editor/nodes/page-break-node';
import { PollNode } from '@/components/editor/nodes/poll-node';
import { editorTheme } from '@/components/editor/themes/editor-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Document } from '@/types/db';
import { Plugins } from './plugins';

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    // AutocompleteNode,
    LinkNode,
    AutoLinkNode,
    FigmaNode,
    TweetNode,
    YouTubeNode,
    CodeNode,
    CodeHighlightNode,
    CollapsibleTitleNode,
    CollapsibleContentNode,
    CollapsibleContainerNode,
    EmojiNode,
    EquationNode,
    ExcalidrawNode,
    HashtagNode,
    HorizontalRuleNode,
    ImageNode,
    InlineImageNode,
    KeywordNode,
    OverflowNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    PageBreakNode,
    PollNode,
    AITabNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

interface EditorProps {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  isSaving?: boolean;
  document?: Document;
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  isSaving,
  document,
}: EditorProps) {
  return (
    <div className="bg-background w-full overflow-hidden shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {}),
        }}
      >
        <TooltipProvider>
          <AiTabContext>
            {/* <SharedAutocompleteContext> */}
            <FloatingLinkContext>
              <Plugins
                editorSerializedState={editorSerializedState}
                onSerializedChange={onSerializedChange}
                isSaving={isSaving}
                document={document}
              />

              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={(editorState) => {
                  onChange?.(editorState);
                  onSerializedChange?.(editorState.toJSON());
                }}
              />
            </FloatingLinkContext>
            {/* </SharedAutocompleteContext> */}
          </AiTabContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
