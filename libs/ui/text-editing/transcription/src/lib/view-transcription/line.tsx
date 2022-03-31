import { ILine } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { hexToRgba } from '@frontend/util';
import { darken } from '@mui/material';
import { selectTokensOfLine, useAppSelector } from '@frontend/shared-ui';
import { Token } from './token';

export interface ILineProps {
  d: Omit<ILine, 'Tokens'> & { ElementId: string };
  elementType: 'main' | 'other';
}

export const Line = ({ d, elementType }: ILineProps) => {
  const tokens = useAppSelector((state) => selectTokensOfLine(state, d.Id));
  return (
    <Stack
      sx={{
        width: '100%',
        mt: '10px',
        bgcolor: d.HighlightColor
          ? hexToRgba(d.HighlightColor, 0.1)
          : 'rgba(0,0,0, 0.2)',
        border: '3px solid',
        borderColor: d.HighlightColor ? darken(d.HighlightColor, 0.1) : 'black',
        borderRadius: '5px',
      }}
      alignItems="center"
      direction="row-reverse"
    >
      <Typography sx={{ p: '5px' }} variant="h1">
        {d.LineOrder + 1}
      </Typography>
      <Stack
        flexGrow={1}
        alignItems="center"
        justifyContent="flex-start"
        direction="row-reverse"
        flexWrap="wrap"
      >
        {tokens.length === 0 && (
          <Typography>[This lines has not been transcribed]</Typography>
        )}
        {tokens.map((t) => (
          <Token
            lineOrder={d.LineOrder}
            elementType={elementType}
            key={t.Id}
            d={t}
          />
        ))}
      </Stack>
    </Stack>
  );
};
