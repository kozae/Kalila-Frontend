import { CommandBar } from './command-bar';
import Stack from '@mui/material/Stack';
import { ILine, ITextElement } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { TextElement } from './text-element';
import React, { createContext, useState } from 'react';
import { LinePreview } from '../line-preview';

export interface IViewTranscriptionProps {
  linesToElementMap: Record<
    string,
    (Omit<ILine, 'Tokens'> & { ElementId: string })[]
  >;
  mainBodyElements: Omit<ITextElement, 'Lines'>[];
  otherElements: Omit<ITextElement, 'Lines'>[];
}

export type VisibleAnnotation =
  | 'none'
  | 'vocalized'
  | 'rasm'
  | 'lemma'
  | 'type';

export const ViewTranscription = ({
  mainBodyElements,
  otherElements,
  linesToElementMap,
}: IViewTranscriptionProps) => {
  const [hoveredLineId, setHoveredLineId] = useState<string | undefined>(
    undefined
  );
  const [annotation, setAnnotation] = useState<VisibleAnnotation>('none');

  return (
    <ViewTranscriptionContext.Provider
      value={{
        annotation,
        setAnnotation,
        hoveredLineId,
        setHoveredLineId,
      }}
    >
      <Stack
        sx={{
          height: 'fit-content',
          width: '100%',
          maxHeight: 'calc(100% - 20px)',
          minHeight: 'calc(100% - 20px)',
          overflow: 'scroll',
          mt: '10px',
        }}
        alignItems="center"
      >
        <CommandBar />
        <LinePreview id={hoveredLineId} />
        <Stack sx={{ width: '100%', mt: '10px' }} alignItems="center">
          {mainBodyElements.length !== 0 ? (
            <Typography variant="h2">
              Main Body Elements ({mainBodyElements.length})
            </Typography>
          ) : (
            <Typography>Page Does Not Have Main Body Elements</Typography>
          )}
          {mainBodyElements.map((element) => (
            <TextElement
              key={element.Id}
              element={element}
              lines={linesToElementMap[element.Id]}
            />
          ))}
          {otherElements.length !== 0 ? (
            <Typography sx={{ mt: '10px' }} variant="h2">
              Legends or Marginalia ({otherElements.length})
            </Typography>
          ) : (
            <Typography>Page does not have legends nor marginalia</Typography>
          )}
          {otherElements.map((element) => (
            <TextElement
              key={element.Id}
              element={element}
              lines={linesToElementMap[element.Id]}
            />
          ))}
        </Stack>
      </Stack>
    </ViewTranscriptionContext.Provider>
  );
};

export interface IViewTranscriptionContext {
  annotation: VisibleAnnotation;
  setAnnotation: (a: VisibleAnnotation) => void;
  hoveredLineId: string | undefined;
  setHoveredLineId: (id: string | undefined) => void;
}

export const ViewTranscriptionContext =
  createContext<IViewTranscriptionContext>({
    annotation: 'none',
    setAnnotation: (a: VisibleAnnotation) => {},
    hoveredLineId: undefined,
    setHoveredLineId: (id: string | undefined) => {},
  });
