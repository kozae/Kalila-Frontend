import { IMorphology, IToken } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ViewTranscriptionContext } from './view-transcription';
import { useCallback, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { selectAccessToken, useAppSelector } from '@frontend/shared-ui';
import { paramsSerializer } from '@frontend/util';

export interface ITokenProps {
  d: IToken & { LineId: string };
  lineOrder: number;
  elementType: 'main' | 'other';
}

export const Token = ({ d, lineOrder, elementType }: ITokenProps) => {
  const ref = useRef(null);
  const accessToken = useAppSelector(selectAccessToken);
  const {
    annotation,
    selectedToken,
    setMorphologyPopperAnchor,
    setSelectedToken,
    setMorphologyData,
  } = useContext(ViewTranscriptionContext);
  useEffect(() => {
    if (
      selectedToken.line === lineOrder &&
      selectedToken.token === d.OrderInLine &&
      selectedToken.elementType === elementType &&
      ref
    ) {
      setMorphologyPopperAnchor(ref.current);
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
    if (d.Morphology === undefined) {
      return d.RawToken;
    }
    switch (annotation) {
      case 'vocalized':
        return d.Morphology?.Word;
      case 'rasm':
        return d.Morphology?.Rasm;
      case 'root':
        return d.Morphology?.Root;
      case 'pos':
        return d.Morphology?.PartOfSpeech;
      case 'type':
        return d.Morphology?.Type;
      case 'stem':
        return d.Morphology?.Stem;
      case 'wazn':
        return d.Morphology?.PatLemma;
      default:
        return d.RawToken;
    }
  }, [annotation, d]);
  const handleClick = () => {
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
