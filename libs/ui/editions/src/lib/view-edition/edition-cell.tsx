import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface IEditionCellProps {
  tokens: string[];
  manuscriptId: string;
  unitId: string;
  width: string;
}

export const EditionCell = ({ tokens, width }: IEditionCellProps) => {
  const [renderedTokens, setTokens] = useState<string[]>(tokens);
  return (
    <Stack
      alignItems="flex-start"
      justifyContent="flex-start"
      sx={{ width }}
      direction="row-reverse"
      flexWrap="wrap"
    >
      <Typography
        align="right"
        sx={{ pl: '3px' }}
        fontSize="1rem"
        variant="body2"
      >
        {renderedTokens.join(' ')}
      </Typography>
    </Stack>
  );
};
