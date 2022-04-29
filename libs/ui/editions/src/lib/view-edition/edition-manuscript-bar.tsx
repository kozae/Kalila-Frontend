import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { range } from 'lodash';
import { EditionStore } from '../store';
import { kalilaTheme } from '@frontend/shared-ui';
import { useContext } from 'react';
import { ViewEditionContext, WIDTH_OPTIONS } from './view-edition-context';

export interface IEditionManuscriptBarProps {
  manuscripts: number;
  store: EditionStore;
}

export const EditionManuscriptBar = ({
  manuscripts,
  store,
}: IEditionManuscriptBarProps) => {
  const { size } = useContext(ViewEditionContext);

  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: 'fit-content',
        zIndex: 1,
        boxShadow: kalilaTheme.shadows[4],
      }}
      alignItems="flex-start"
      direction="row"
    >
      {range(manuscripts).map((m) => (
        <Stack
          key={m}
          alignItems="center"
          justifyContent="center"
          sx={{
            width: WIDTH_OPTIONS[size],
            bgcolor: m % 2 ? 'white' : '#F1F1F1',
          }}
        >
          <Typography p=".5rem" fontSize="1.5rem" fontWeight={600}>
            {store.get_ms_siglum(m)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
