import { CommandBar } from './command-bar';
import Stack from '@mui/material/Stack';
import { ILine, IMorphology, ITextElement } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { TextElement } from './text-element';
import React, {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { MorphologyAnnotation } from './morphology-annotation';
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
  | 'root'
  | 'pos'
  | 'type'
  | 'stem'
  | 'wazn';

export const ViewTranscription = ({
  mainBodyElements,
  otherElements,
  linesToElementMap,
}: IViewTranscriptionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | undefined>(
    undefined
  );

  const [annotation, setAnnotation] = useState<VisibleAnnotation>('none');
  const [selectedToken, setSelectedToken] = useState<ISelectedToken>({
    elementType: 'main',
  });
  const [morphologyPopperAnchor, setMorphologyPopperAnchor] =
    useState<null | HTMLElement>(null);
  const [morphologyData, setMorphologyData] = useState<IMorphology[]>([]);
  return (
    <ViewTranscriptionContext.Provider
      value={{
        containerRef: ref,
        annotation,
        setAnnotation,
        morphologyPopperAnchor,
        setMorphologyPopperAnchor,
        selectedToken,
        setSelectedToken,
        morphologyData,
        setMorphologyData,
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
        ref={ref}
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
              elementType="main"
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
              elementType="other"
            />
          ))}
        </Stack>
        <MorphologyAnnotation
          {...{
            mainBodyElements,
            otherElements,
            linesToElementMap,
          }}
        />
      </Stack>
    </ViewTranscriptionContext.Provider>
  );
};

export interface ISelectedToken {
  line?: number;
  token?: number;
  elementType: 'main' | 'other';
}

export interface IViewTranscriptionContext {
  annotation: VisibleAnnotation;
  setAnnotation: (a: VisibleAnnotation) => void;
  selectedToken: ISelectedToken;
  morphologyPopperAnchor: HTMLElement | null;
  setSelectedToken?: Dispatch<SetStateAction<ISelectedToken>>;
  setMorphologyPopperAnchor: (el: any) => void;
  morphologyData: IMorphology[];
  setMorphologyData: (d: IMorphology[]) => void;
  containerRef?: RefObject<HTMLDivElement>;
  hoveredLineId: string | undefined;
  setHoveredLineId: (id: string | undefined) => void;
}

export const ViewTranscriptionContext =
  createContext<IViewTranscriptionContext>({
    annotation: 'none',
    selectedToken: { elementType: 'main' },
    setAnnotation: (a: VisibleAnnotation) => {},
    morphologyPopperAnchor: null,
    setMorphologyPopperAnchor: (el: any) => {},
    morphologyData: [],
    setMorphologyData: (d: IMorphology[]) => {},
    hoveredLineId: undefined,
    setHoveredLineId: (id: string | undefined) => {},
  });
