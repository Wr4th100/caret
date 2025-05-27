import { useState } from 'react';
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { SerializedEditorState } from 'lexical';
import { Loader2 } from 'lucide-react';

import AIPanel from '@/components/editor/ai-panel';
import { ContentEditable } from '@/components/editor/editor-ui/content-editable';
import { ActionsPlugin } from '@/components/editor/plugins/actions/actions-plugin';
import { ClearEditorActionPlugin } from '@/components/editor/plugins/actions/clear-editor-plugin';
import { CounterCharacterPlugin } from '@/components/editor/plugins/actions/counter-character-plugin';
import { ImportExportPlugin } from '@/components/editor/plugins/actions/import-export-plugin';
import { MarkdownTogglePlugin } from '@/components/editor/plugins/actions/markdown-toggle-plugin';
import { SpeechToTextPlugin } from '@/components/editor/plugins/actions/speech-to-text-plugin';
import { TreeViewPlugin } from '@/components/editor/plugins/actions/tree-view-plugin';
import { AITabPlugin } from '@/components/editor/plugins/ai-tab-plugin';
import { AutoLinkPlugin } from '@/components/editor/plugins/auto-link-plugin';
// import { AutocompletePlugin } from '@/components/editor/plugins/autocomplete-plugin';
import { CodeHighlightPlugin } from '@/components/editor/plugins/code-highlight-plugin';
import { CollapsiblePlugin } from '@/components/editor/plugins/collapsible-plugin';
import { ComponentPickerMenuPlugin } from '@/components/editor/plugins/component-picker-menu-plugin';
import { ContextMenuPlugin } from '@/components/editor/plugins/context-menu-plugin';
import { DragDropPastePlugin } from '@/components/editor/plugins/drag-drop-paste-plugin';
import { DraggableBlockPlugin } from '@/components/editor/plugins/draggable-block-plugin';
import { TwitterPlugin } from '@/components/editor/plugins/embeds/twitter-plugin';
import { EmojiPickerPlugin } from '@/components/editor/plugins/emoji-picker-plugin';
import { EmojisPlugin } from '@/components/editor/plugins/emojis-plugin';
import { EquationsPlugin } from '@/components/editor/plugins/equations-plugin';
import { ExcalidrawPlugin } from '@/components/editor/plugins/excalidraw-plugin';
import { FloatingLinkEditorPlugin } from '@/components/editor/plugins/floating-link-editor-plugin';
import { FloatingTextFormatToolbarPlugin } from '@/components/editor/plugins/floating-text-format-plugin';
import { ImagesPlugin } from '@/components/editor/plugins/images-plugin';
import { InlineImagePlugin } from '@/components/editor/plugins/inline-image-plugin';
import { KeywordsPlugin } from '@/components/editor/plugins/keywords-plugin';
import { LinkPlugin } from '@/components/editor/plugins/link-plugin';
import { MentionsPlugin } from '@/components/editor/plugins/mentions-plugin';
import { PageBreakPlugin } from '@/components/editor/plugins/page-break-plugin';
import { AlignmentPickerPlugin } from '@/components/editor/plugins/picker/alignment-picker-plugin';
import { BulletedListPickerPlugin } from '@/components/editor/plugins/picker/bulleted-list-picker-plugin';
import { CheckListPickerPlugin } from '@/components/editor/plugins/picker/check-list-picker-plugin';
import { CodePickerPlugin } from '@/components/editor/plugins/picker/code-picker-plugin';
import { CollapsiblePickerPlugin } from '@/components/editor/plugins/picker/collapsible-picker-plugin';
import { ColumnsLayoutPickerPlugin } from '@/components/editor/plugins/picker/columns-layout-picker-plugin';
import { DividerPickerPlugin } from '@/components/editor/plugins/picker/divider-picker-plugin';
import { EmbedsPickerPlugin } from '@/components/editor/plugins/picker/embeds-picker-plugin';
import { EquationPickerPlugin } from '@/components/editor/plugins/picker/equation-picker-plugin';
import { ExcalidrawPickerPlugin } from '@/components/editor/plugins/picker/excalidraw-picker-plugin';
import { HeadingPickerPlugin } from '@/components/editor/plugins/picker/heading-picker-plugin';
import { ImagePickerPlugin } from '@/components/editor/plugins/picker/image-picker-plugin';
import { NumberedListPickerPlugin } from '@/components/editor/plugins/picker/numbered-list-picker-plugin';
import { PageBreakPickerPlugin } from '@/components/editor/plugins/picker/page-break-picker-plugin';
import { ParagraphPickerPlugin } from '@/components/editor/plugins/picker/paragraph-picker-plugin';
import { PollPickerPlugin } from '@/components/editor/plugins/picker/poll-picker-plugin';
import { QuotePickerPlugin } from '@/components/editor/plugins/picker/quote-picker-plugin';
import { TablePickerPlugin } from '@/components/editor/plugins/picker/table-picker-plugin';
import { PollPlugin } from '@/components/editor/plugins/poll-plugin';
import { TabFocusPlugin } from '@/components/editor/plugins/tab-focus-plugin';
import { TableActionMenuPlugin } from '@/components/editor/plugins/table-action-menu-plugin';
import { TableCellResizerPlugin } from '@/components/editor/plugins/table-cell-resizer-plugin';
import { TableHoverActionsPlugin } from '@/components/editor/plugins/table-hover-actions-plugin';
import { BlockFormatDropDown } from '@/components/editor/plugins/toolbar/block-format-toolbar-plugin';
import { FormatBulletedList } from '@/components/editor/plugins/toolbar/block-format/format-bulleted-list';
import { FormatCheckList } from '@/components/editor/plugins/toolbar/block-format/format-check-list';
import { FormatCodeBlock } from '@/components/editor/plugins/toolbar/block-format/format-code-block';
import { FormatHeading } from '@/components/editor/plugins/toolbar/block-format/format-heading';
import { FormatNumberedList } from '@/components/editor/plugins/toolbar/block-format/format-numbered-list';
import { FormatParagraph } from '@/components/editor/plugins/toolbar/block-format/format-paragraph';
import { FormatQuote } from '@/components/editor/plugins/toolbar/block-format/format-quote';
import { BlockInsertPlugin } from '@/components/editor/plugins/toolbar/block-insert-plugin';
import { InsertCollapsibleContainer } from '@/components/editor/plugins/toolbar/block-insert/insert-collapsible-container';
import { InsertColumnsLayout } from '@/components/editor/plugins/toolbar/block-insert/insert-columns-layout';
import { InsertEquation } from '@/components/editor/plugins/toolbar/block-insert/insert-equation';
import { InsertExcalidraw } from '@/components/editor/plugins/toolbar/block-insert/insert-excalidraw';
import { InsertHorizontalRule } from '@/components/editor/plugins/toolbar/block-insert/insert-horizontal-rule';
import { InsertImage } from '@/components/editor/plugins/toolbar/block-insert/insert-image';
import { InsertInlineImage } from '@/components/editor/plugins/toolbar/block-insert/insert-inline-image';
import { InsertPageBreak } from '@/components/editor/plugins/toolbar/block-insert/insert-page-break';
import { InsertPoll } from '@/components/editor/plugins/toolbar/block-insert/insert-poll';
import { InsertTable } from '@/components/editor/plugins/toolbar/block-insert/insert-table';
import { ClearFormattingToolbarPlugin } from '@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin';
import { CodeActionMenuPlugin } from '@/components/editor/plugins/toolbar/code-action-menu-plugin';
import { CodeLanguageToolbarPlugin } from '@/components/editor/plugins/toolbar/code-language-toolbar-plugin';
import { ElementFormatToolbarPlugin } from '@/components/editor/plugins/toolbar/element-format-toolbar-plugin';
import { FontBackgroundToolbarPlugin } from '@/components/editor/plugins/toolbar/font-background-toolbar-plugin';
import { FontColorToolbarPlugin } from '@/components/editor/plugins/toolbar/font-color-toolbar-plugin';
import { FontFamilyToolbarPlugin } from '@/components/editor/plugins/toolbar/font-family-toolbar-plugin';
import { FontFormatToolbarPlugin } from '@/components/editor/plugins/toolbar/font-format-toolbar-plugin';
import { FontSizeToolbarPlugin } from '@/components/editor/plugins/toolbar/font-size-toolbar-plugin';
import { HistoryToolbarPlugin } from '@/components/editor/plugins/toolbar/history-toolbar-plugin';
import { LinkToolbarPlugin } from '@/components/editor/plugins/toolbar/link-toolbar-plugin';
import { SubSuperToolbarPlugin } from '@/components/editor/plugins/toolbar/subsuper-toolbar-plugin';
import { ToolbarPlugin } from '@/components/editor/plugins/toolbar/toolbar-plugin';
import { EMOJI } from '@/components/editor/transformers/markdown-emoji-transformer';
import { EQUATION } from '@/components/editor/transformers/markdown-equation-transofrmer';
import { HR } from '@/components/editor/transformers/markdown-hr-transformer';
import { IMAGE } from '@/components/editor/transformers/markdown-image-transformer';
import { TABLE } from '@/components/editor/transformers/markdown-table-transformer';
import { TWEET } from '@/components/editor/transformers/markdown-tweet-transformer';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Document } from '@/types/db';

export function Plugins({
  // editorSerializedState,
  // onSerializedChange,
  isSaving,
  document,
}: {
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  isSaving?: boolean;
  document?: Document;
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative flex h-full flex-col justify-between">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex flex-row items-center gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={['h1', 'h2', 'h3']} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === 'code' ? <CodeLanguageToolbarPlugin /> : <></>}
            <FontFamilyToolbarPlugin />
            <FontSizeToolbarPlugin />
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
            <SubSuperToolbarPlugin />
            <FontColorToolbarPlugin />
            <FontBackgroundToolbarPlugin />
            <ElementFormatToolbarPlugin />
            <ClearFormattingToolbarPlugin />
            <LinkToolbarPlugin />
            <BlockInsertPlugin>
              <InsertCollapsibleContainer />
              <InsertEquation />
              <InsertExcalidraw />
              <InsertHorizontalRule />
              <InsertImage />
              <InsertInlineImage />
              <InsertColumnsLayout />
              <InsertPageBreak />
              <InsertPoll />
              <InsertTable />
            </BlockInsertPlugin>
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative flex flex-row">
        {/* editor plugins */}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultValue={75}>
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <div className="h-full">
                    <ScrollArea className="h-[900px]" ref={onRef}>
                      <ContentEditable placeholder={'Start typing ...'} />
                    </ScrollArea>
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <ListPlugin />
              <CheckListPlugin />
              <TabIndentationPlugin />
              <ClickableLinkPlugin />
              <AutoLinkPlugin />
              <LinkPlugin />
              <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
              <DragDropPastePlugin />
              {/* <AutocompletePlugin /> */}
              <AITabPlugin />
              <AutoFocusPlugin />
              <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
              <CodeHighlightPlugin />
              <CollapsiblePlugin />
              <ComponentPickerMenuPlugin
                baseOptions={[
                  ParagraphPickerPlugin(),
                  HeadingPickerPlugin({ n: 1 }),
                  HeadingPickerPlugin({ n: 2 }),
                  HeadingPickerPlugin({ n: 3 }),
                  QuotePickerPlugin(),
                  AlignmentPickerPlugin({ alignment: 'left' }),
                  AlignmentPickerPlugin({ alignment: 'right' }),
                  AlignmentPickerPlugin({ alignment: 'center' }),
                  AlignmentPickerPlugin({ alignment: 'justify' }),
                  BulletedListPickerPlugin(),
                  CheckListPickerPlugin(),
                  CodePickerPlugin(),
                  CollapsiblePickerPlugin(),
                  DividerPickerPlugin(),
                  CollapsiblePickerPlugin(),
                  ColumnsLayoutPickerPlugin(),
                  EmbedsPickerPlugin({ embed: 'figma' }),
                  EmbedsPickerPlugin({ embed: 'youtube-video' }),
                  EmbedsPickerPlugin({ embed: 'tweet' }),
                  EquationPickerPlugin(),
                  ExcalidrawPickerPlugin(),
                  ImagePickerPlugin(),
                  NumberedListPickerPlugin(),
                  PageBreakPickerPlugin(),
                  PollPickerPlugin(),
                  QuotePickerPlugin(),
                  TablePickerPlugin(),
                ]}
              />
              <ContextMenuPlugin />
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
              <EmojisPlugin />
              <EmojiPickerPlugin />
              <EquationsPlugin />
              <ExcalidrawPlugin />
              <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
              <HashtagPlugin />
              <HorizontalRulePlugin />
              <ImagesPlugin />
              <InlineImagePlugin />
              <KeywordsPlugin />
              <TwitterPlugin />
              <TableCellResizerPlugin />
              <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
              <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
              <MarkdownShortcutPlugin
                transformers={[
                  TABLE,
                  HR,
                  IMAGE,
                  EMOJI,
                  EQUATION,
                  TWEET,
                  CHECK_LIST,
                  ...ELEMENT_TRANSFORMERS,
                  ...MULTILINE_ELEMENT_TRANSFORMERS,
                  ...TEXT_FORMAT_TRANSFORMERS,
                  ...TEXT_MATCH_TRANSFORMERS,
                ]}
              />
              <MentionsPlugin />
              <PageBreakPlugin />
              <PollPlugin />
              <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
              <TableCellResizerPlugin />
              <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
              <TabFocusPlugin />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultValue={25}>
            <div>
              <AIPanel document={document!} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* actions plugins */}
      <ActionsPlugin>
        <div className="clear-both flex w-full items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
            {isSaving && (
              <div className="ml-2 flex items-center gap-1">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-muted-foreground text-xs">Saving...</span>
              </div>
            )}
          </div>
          <div>
            {/* center action buttons */}
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            {/* right side action buttons */}
            <SpeechToTextPlugin />
            <ImportExportPlugin />
            <>
              <MarkdownTogglePlugin
                transformers={[
                  TABLE,
                  HR,
                  IMAGE,
                  EMOJI,
                  EQUATION,
                  TWEET,
                  CHECK_LIST,
                  ...ELEMENT_TRANSFORMERS,
                  ...MULTILINE_ELEMENT_TRANSFORMERS,
                  ...TEXT_FORMAT_TRANSFORMERS,
                  ...TEXT_MATCH_TRANSFORMERS,
                ]}
                shouldPreserveNewLinesInMarkdown={true}
              />
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
            <TreeViewPlugin />
          </div>
        </div>
      </ActionsPlugin>
    </div>
  );
}
