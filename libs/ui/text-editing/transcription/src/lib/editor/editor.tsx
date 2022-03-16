import React, { useCallback, useMemo, useState } from 'react';
import { BaseEditor, createEditor, Descendant, Path, Transforms } from 'slate';
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
import ObjectID from 'bson-objectid';
import { flatten } from 'lodash';

type EditorTokenModel = {
  state?: TokenState;
  text: string;
  id?: string | number | undefined;
};
type EditorLineModel = {
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
  const [value, setValue] = useState<Descendant[]>(
    lines.map((l) => ({
      id: l._id as string,
      color: l.HighlightColor as string,
      order: l.LineOrder as number,
      children:
        tokenToLineIdMap[l._id] === undefined
          ? [{ text: '', state: 'sound', id: `new_${ObjectID().toString()}` }]
          : flatten(
              tokenToLineIdMap[l._id].map((t, index) => [
                {
                  text: t.RawToken,
                  state: t.State as any,
                  id: t._id,
                },
                {
                  text: ' ',
                  state: 'sound',
                  id: `space_${t._id}`,
                },
              ])
            ),
    }))
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const handleChange = useCallback(
    (value: any) => {
      const focusedLine = editor.selection?.anchor.path;
      if (focusedLine) {
        const line = lines[focusedLine[0]];
        if (line._id !== focusedLineId) {
          setFocusedLineId(line._id);
          dispatch(
            onRegionHoveredInToolSpace({
              ...line.FacsimileRegion,
              Id: line._id,
            })
          );
        }
      }
      console.log(value);
      setValue(value);
    },
    [editor, focusedLineId]
  );

  const clearPreviews = () => {
    setFocusedLineId(undefined);
    dispatch(onRegionHoveredInToolSpace(null));
  };

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
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Editable
          style={{
            textAlign: 'right',
            direction: 'rtl',
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          onBlur={clearPreviews}
          onKeyDown={(event) => {
            if (event.code === 'Space') {
              event.preventDefault();
              const focusedLine = editor.selection?.anchor.path as Path;
              Transforms.insertNodes(
                editor,
                {
                  state: 'sound',
                  text: ' ',
                  id: `new_${ObjectID().toString()}`,
                },
                { at: Path.next(focusedLine) }
              );
              Transforms.move(editor, { distance: 1, unit: 'character' });
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              const focusedLine = editor.selection?.anchor.path;
              if (focusedLine && focusedLine[0] < lines.length) {
                Transforms.move(editor, { distance: 1, unit: 'line' });
              }
            }
          }}
          renderElement={(props) => <EditorLine {...props} />}
          placeholder="Enter some plain text..."
        />
      </Slate>
    </Stack>
  );
};
