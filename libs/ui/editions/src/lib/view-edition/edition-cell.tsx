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
      component="p"
    >
      {renderedTokens.map((token, index) => (
        <Typography
          key={`${token}_${index}`}
          fontSize="1rem"
          variant="body2"
          component="span"
          sx={{ p: '3px' }}
        >
          {token}
        </Typography>
      ))}
      {renderedTokens.length === 0 && (
        <Typography align="right" fontSize="1rem" variant="body2">
          [ absent ]
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }} />
    </Stack>
  );
};
