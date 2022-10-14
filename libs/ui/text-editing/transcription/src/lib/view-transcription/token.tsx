import { IToken } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ViewTranscriptionContext } from './view-transcription';
import { useCallback, useContext, useRef } from 'react';
import styles from './token.module.scss';

export interface ITokenProps {
  d: IToken & { LineId: string };
}

export const Token = ({ d }: ITokenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { annotation } = useContext(ViewTranscriptionContext);

  const getAnnotation = useCallback(() => {
    if (d.Morphology === undefined) {
      return d.RawToken;
    }
    switch (annotation) {
      case 'vocalized':
        return d.Morphology ? d.Morphology[1] : d.RawToken;
      case 'rasm':
        return d.RawToken;
      case 'type':
        return d.Morphology ? d.Morphology[2] : d.RawToken;
      case 'lemma':
        return d.Morphology ? d.Morphology[0] : d.RawToken;
      default:
        return d.RawToken;
    }
  }, [annotation, d]);

  return (
    <Stack ref={ref}>
      <Typography
        className={styles[d.State]}
        sx={{
          ml: '3px',
          pt: '3px',
          pb: '3px',
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
