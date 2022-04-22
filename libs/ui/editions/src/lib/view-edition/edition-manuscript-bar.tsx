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
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: 'fit-content',
        zIndex: 1,
      }}
      alignItems="flex-start"
      direction="row"
    >
      {manuscripts.map((m) => (
        <Stack
          key={m.Id}
          alignItems="center"
          justifyContent="center"
          sx={{
            width: '200px',
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
