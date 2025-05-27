import { $createCodeNode } from '@lexical/code';
import { $createListItemNode } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  ElementNode,
  LexicalEditor,
} from 'lexical';

import { AIInstruction } from '@/types/api';

export function applyAIInstruction(editor: LexicalEditor, instructions: AIInstruction[]) {
  editor.update(() => {
    const root = $getRoot();
    const children = root.getChildren();
    const orderedInstructions = instructions.reverse(); // Reverse to apply from the end to the start
    orderedInstructions.map((instruction) => {
      // If targetIndex is out of bounds, take the last child
      let targetIndex = instruction.targetIndex;
      if (instruction.targetIndex < 0 || instruction.targetIndex >= children.length) {
        targetIndex = children.length - 1; // Use the last child if out of bounds
      }

      const targetNode = children[targetIndex];

      console.log('Applying instruction:', instruction, 'to node:', targetNode);

      if (!targetNode) return;

      switch (instruction.type) {
        case 'edit': {
          (targetNode as ElementNode).clear();
          (targetNode as ElementNode).append($createTextNode(instruction.newContent));

          setTimeout(() => {
            const domElement = editor.getElementByKey(targetNode.getKey());
            if (domElement) {
              domElement.classList.add('ai-fade-in');
              setTimeout(() => {
                domElement.classList.remove('ai-fade-in');
              }, 1000);
            }
          }, 0);

          setTimeout(() => {
            const domElement = editor.getElementByKey(targetNode.getKey());
            if (domElement) {
              domElement.classList.add('ai-highlight-fade');
            }
            setTimeout(() => {
              domElement?.classList.remove('ai-highlight-fade');
            }, 4000);
          }, 0);

          break;
        }

        case 'insert': {
          const newNode = createNodeOfType(
            instruction.nodeType,
            instruction.content,
            instruction.language,
          );

          if (instruction.position === 'above') {
            targetNode.insertBefore(newNode);
          } else {
            targetNode.insertAfter(newNode);
          }

          setTimeout(() => {
            const dom = editor.getElementByKey(newNode.getKey());
            dom?.classList.add('ai-fade-in');
            setTimeout(() => dom?.classList.remove('ai-fade-in'), 1000);
          }, 0);

          setTimeout(() => {
            const domElement = editor.getElementByKey(newNode.getKey());
            if (domElement) {
              domElement.classList.add('ai-highlight-fade');
            }
            setTimeout(() => {
              domElement?.classList.remove('ai-highlight-fade');
            }, 4000);
          }, 0);
          break;
        }
      }
    });
  });
}

function createNodeOfType(type: string, content: string, language?: string) {
  switch (type) {
    case 'paragraph':
      return $createParagraphNode().append($createTextNode(content));
    case 'quote':
      return $createQuoteNode().append($createTextNode(content));
    case 'heading':
      return $createHeadingNode('h2').append($createTextNode(content));
    case 'code':
      return $createCodeNode(language ?? 'javascript').append($createTextNode(content));
    case 'listitem':
      return $createListItemNode().append($createTextNode(content));
    // Add others...
    default:
      return $createParagraphNode().append($createTextNode(content));
  }
}
