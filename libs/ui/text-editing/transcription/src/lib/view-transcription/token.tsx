import { IMorphology, IToken } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ViewTranscriptionContext } from './view-transcription';
import { RefObject, useCallback, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  selectAccessToken,
  selectMorphologyByLineAndToken,
  selectTextEditingAccessMode,
  useAppSelector,
} from '@frontend/shared-ui';
import { paramsSerializer } from '@frontend/util';

export interface ITokenProps {
  d: IToken & { LineId: string };
  lineOrder: number;
  elementType: 'main' | 'other';
  lineRef: RefObject<HTMLDivElement>;
}

export const Token = ({ d, lineOrder, elementType, lineRef }: ITokenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const accessToken = useAppSelector(selectAccessToken);
  const morphology = useAppSelector((state) =>
    selectMorphologyByLineAndToken(state, `${d.LineId}_${d.OrderInLine}`)
  );
  const {
    annotation,
    selectedToken,
    setMorphologyPopperAnchor,
    setSelectedToken,
    setMorphologyData,
    containerRef,
  } = useContext(ViewTranscriptionContext);
  useEffect(() => {
    if (
      selectedToken.line === lineOrder &&
      selectedToken.token === d.OrderInLine &&
      selectedToken.elementType === elementType &&
      ref
    ) {
      setMorphologyPopperAnchor(ref.current);
      if (containerRef && lineRef && lineRef.current && containerRef.current) {
        containerRef.current.scrollTo({
          top: lineRef.current.offsetTop - 100,
        });
      }
      axios
        .get<Record<string, IMorphology[]>>('/server/api/v1/Morphology/Word', {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
          params: { Words: [d.RawToken] },
          paramsSerializer,
        })
        .then(({ data }) => setMorphologyData(data[d.RawToken]));
    }
  }, [selectedToken]);
  const getAnnotation = useCallback(() => {
    if (morphology === undefined) {
      return d.RawToken;
    }
    switch (annotation) {
      case 'vocalized':
        return morphology?.Word;
      case 'rasm':
        return morphology?.Rasm;
      case 'root':
        return morphology?.Root;
      case 'pos':
        return morphology?.PartOfSpeech;
      case 'type':
        return morphology?.Type;
      case 'stem':
        return morphology?.Stem;
      case 'wazn':
        return morphology.Canonic;
      default:
        return d.RawToken;
    }
  }, [annotation, d, morphology]);
  const accessMode = useAppSelector(selectTextEditingAccessMode);

  const handleClick = () => {
    if (accessMode === 'view') {
      return;
    }
    if (setSelectedToken) {
      setSelectedToken({ line: lineOrder, token: d.OrderInLine, elementType });
    }
  };
  return (
    <Stack ref={ref}>
      <Typography
        onClick={handleClick}
        sx={{
          ml: '3px',
          pt: '3px',
          pb: '3px',
          fontWeight:
            selectedToken.line === lineOrder &&
            selectedToken.elementType === elementType &&
            selectedToken.token === d.OrderInLine
              ? 'bold'
              : 'normal',
        }}
        variant="body2"
      >
        {d.RawToken}
      </Typography>
      {annotation !== 'none' && (
        <Typography
          sx={{
            ml: '3px',
            borderTop: 'dashed 1px black',
            fontSize: '1rem',
            pt: '3px',
            pb: '3px',
          }}
          color={d.Morphology !== undefined ? 'black' : 'rgba(0,0,0, 0.5)'}
          variant="body2"
          align="right"
        >
          {getAnnotation()}
        </Typography>
      )}
    </Stack>
  );
};
