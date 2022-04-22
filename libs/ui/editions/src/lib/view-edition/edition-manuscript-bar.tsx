import Stack from '@mui/material/Stack';
import { IManuscriptEdition } from '@frontend/domain';
import Typography from '@mui/material/Typography';

export interface IEditionManuscriptBarProps {
  manuscripts: IManuscriptEdition[];
}

export const EditionManuscriptBar = ({
  manuscripts,
}: IEditionManuscriptBarProps) => {
  return (
    <Stack
      sx={{ position: 'sticky', top: 0, bgcolor: 'white' }}
      alignItems="flex-start"
      spacing={1}
      direction="row"
    >
      {manuscripts.map((m) => (
        <Stack
          key={m.Id}
          alignItems="center"
          justifyContent="center"
          sx={{
            width: `${Math.floor(100 / manuscripts.length)}vw`,
            bgcolor: 'white',
          }}
        >
          <Typography p=".5rem" fontSize="1rem">
            {m.Siglum}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
