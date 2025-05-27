import type {
  EditorConfig,
  EditorThemeClassName,
  LexicalEditor,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import * as React from 'react';
import { JSX } from 'react';
import { DecoratorNode } from 'lexical';
import { motion } from 'motion/react';

import { uuid as UUID } from '@/components/editor/plugins/ai-tab-plugin';
import { cn } from '@/lib/utils';
import { useAITabContext } from '../context/ai-tab-context';

declare global {
  interface Navigator {
    userAgentData?: {
      mobile: boolean;
    };
  }
}

export type SerializedAITabNode = Spread<
  {
    uuid: string;
    tags?: string[];
  },
  SerializedLexicalNode
>;

export class AITabNode extends DecoratorNode<JSX.Element | null> {
  /**
   * A unique uuid is generated for each session and assigned to the instance.
   * This helps to:
   * - Ensures max one Autocomplete node per session.
   * - Ensure that when collaboration is enabled, this node is not shown in
   *   other sessions.
   * See https://github.com/facebook/lexical/blob/master/packages/lexical-playground/src/plugins/AutocompletePlugin/index.tsx#L39
   */
  __uuid: string;

  static clone(node: AITabNode): AITabNode {
    return new AITabNode(node.__uuid, node.__key);
  }

  static getType(): string {
    return 'aiTab';
  }

  static importJSON(serializedNode: SerializedAITabNode): AITabNode {
    const node = $createAITabNode(serializedNode.uuid);
    return node;
  }

  getTags(): Array<string> {
    return ['ai-edited'];
  }

  exportJSON(): SerializedAITabNode {
    return {
      ...super.exportJSON(),
      type: 'aiTab',
      uuid: this.__uuid,
      tags: this.getTags(),
      version: 1,
    };
  }

  constructor(uuid: string, key?: NodeKey) {
    super(key);
    this.__uuid = uuid;
  }

  updateDOM(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prevNode: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dom: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config: EditorConfig,
  ): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createDOM(config: EditorConfig): HTMLElement {
    return document.createElement('span');
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element | null {
    if (this.__uuid !== UUID) {
      return null;
    }
    return <AITabComponent className={config.theme.aiTab} />;
  }
}

export function $createAITabNode(uuid: string): AITabNode {
  return new AITabNode(uuid);
}

function AITabComponent({ className }: { className: EditorThemeClassName }): JSX.Element {
  const [suggestion] = useAITabContext();
  const userAgentData = window.navigator.userAgentData;
  const isMobile =
    userAgentData !== undefined
      ? userAgentData.mobile
      : window.innerWidth <= 800 && window.innerHeight <= 600;
  return (
    <motion.span
      className={cn(className)}
      spellCheck="false"
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {suggestion} {isMobile ? '(SWIPE \u2B95)' : '(TAB)'}
    </motion.span>
  );
}
