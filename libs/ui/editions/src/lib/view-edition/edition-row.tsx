import { IEditionBookUnit } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EditionCell } from './edition-cell';

export interface IEditionRowProps {
  bookUnit: IEditionBookUnit;
  units: {
    id: string;
    manuscriptId: string;
    siglum: string;
    tokens: string[];
  }[];
}

export const EditionRow = ({ bookUnit, units }: IEditionRowProps) => {
  return (
    <Stack alignItems="center">
      <Typography sx={{ p: '10px' }} variant="h5">
        ({bookUnit.Order}) {bookUnit.Title}
      </Typography>
      <Stack alignItems="flex-start" spacing={1} direction="row">
        {units.map((u) => (
          <EditionCell
            key={u.manuscriptId}
            tokens={u.tokens}
            unitId={u.id}
            manuscriptId={u.manuscriptId}
            width={`${Math.floor(100 / units.length)}vw`}
          />
        ))}
      </Stack>
    </Stack>
  );
};
