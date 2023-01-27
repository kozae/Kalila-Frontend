import { BaseEditor, NodeEntry, Text, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export function withKalilaNormalization(
  editor: BaseEditor & ReactEditor & HistoryEditor
) {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry: NodeEntry<any>) => {
    const [node, path] = entry;

    if (Text.isText(node)) {
      if (node.text.trim().length === 0) {
        Transforms.setNodes(editor, { state: 'sound' }, { at: path });
        return;
      }
    }
    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };
  return editor;
}
