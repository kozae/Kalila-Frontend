import React, { useCallback, useMemo, useState } from 'react';
import {
  BaseEditor,
  createEditor,
  Descendant,
  Element,
  Transforms,
} from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Stack from '@mui/material/Stack';
import {
  onRegionHoveredInToolSpace,
  useAppDispatch,
} from '@frontend/shared-ui';
import { ILine, IToken, TokenState } from '@frontend/domain';
import { EditorLine } from './editor-line';
import { LinePreview } from './line-preview';
import { CommandBar } from './command-bar';
import { EditorText } from './editor-text';
import { saveEditorValueToStore } from '../helpers';
import { withKalilaNormalization } from '../helpers/with-kalila-normalization';

export type EditorTokenModel = {
  state?: TokenState;
  text: string;
};
export type EditorLineModel = {
  id: string;
  color: string;
  order: number;
  children: EditorTokenModel[];
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: EditorLineModel;
    Text: EditorTokenModel;
  }
}

const allowedKeys = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Alt',
  'Shift',
  'Control',
  'Meta',
  'Enter',
  'Backspace',
  ' ',
];

export interface IKalilaEditorProps {
  lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
  tokenToLineIdMap: Record<string, IToken[]>;
}

export const KalilaEditor = ({
  lines,
  tokenToLineIdMap,
}: IKalilaEditorProps) => {
  const dispatch = useAppDispatch();
  const [focusedLineId, setFocusedLineId] = useState<string | undefined>(
    undefined
  );

  const mapLinesToEditorValue = (
    lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[]
  ) =>
    lines.map((l) => ({
      id: l.Id as string,
      color: l.HighlightColor as string,
      order: l.LineOrder as number,
      children:
        tokenToLineIdMap[l.Id] === undefined
          ? [{ text: '', state: 'sound' }]
          : tokenToLineIdMap[l.Id].map((t, index) => ({
              text: t.RawToken + ' ',
              state: t.State as any,
            })),
    }));

  const [value, setValue] = useState<Descendant[]>(
    mapLinesToEditorValue(lines)
  );

  const editor = useMemo(
    () => withKalilaNormalization(withHistory(withReact(createEditor()))),
    []
  );
  const handleChange = useCallback(
    (value: Element[]) => {
      console.log(value);
      setValue(value);
      const focusedLine = editor.selection?.anchor.path;
      if (focusedLine) {
        const line = lines[focusedLine[0]];
        if (line.Id !== focusedLineId) {
          setFocusedLineId(line.Id);
          dispatch(
            onRegionHoveredInToolSpace({
              ...line.FacsimileRegion,
              Id: line.Id,
            })
          );
        }
      }
      saveEditorValueToStore(value, tokenToLineIdMap, dispatch);
    },
    [editor, focusedLineId, tokenToLineIdMap]
  );

  const clearPreviews = () => {
    setFocusedLineId(undefined);
    dispatch(onRegionHoveredInToolSpace(null));
  };

  const renderLeaf = useCallback((props: any) => {
    return <EditorText {...props} />;
  }, []);

  return (
    <Stack
      sx={{
        height: 'fit-content',
        width: '100%',
        maxHeight: 'calc(100% - 10px)',
        minHeight: 'calc(100% - 10px)',
        overflow: 'scroll',
        mt: '10px',
      }}
    >
      <CommandBar editor={editor} />
      <LinePreview id={focusedLineId} />
      <Slate
        editor={editor}
        value={value}
        onChange={(v) => handleChange(v as Element[])}
      >
        <Editable
          style={{
            textAlign: 'right',
            direction: 'rtl',
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          onBlur={clearPreviews}
          onDOMBeforeInput={(e) => {
            console.log(e);
          }}
          onKeyDown={(event) => {
            if (event.ctrlKey || event.metaKey) {
            } else if (
              /[\u0621-\u0652-]/.exec(event.key) === null &&
              !allowedKeys.includes(event.key)
            ) {
              event.preventDefault();
              console.log('preventing');
              console.log(event.key);
            } else if (event.key === 'Enter') {
              event.preventDefault();
              const focusedLine = editor.selection?.anchor.path;
              if (focusedLine && focusedLine[0] < lines.length) {
                Transforms.move(editor, { distance: 1, unit: 'line' });
              }
            } else if (event.key === 'Backspace') {
              const { selection } = editor;
              if (
                selection?.anchor.offset === 0 &&
                selection?.focus.offset === 0
              ) {
                event.preventDefault();
                Transforms.move(editor, {
                  distance: 1,
                  unit: 'character',
                  reverse: true,
                });
              }
            }
          }}
          renderElement={(props) => <EditorLine {...props} />}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </Stack>
  );
};
