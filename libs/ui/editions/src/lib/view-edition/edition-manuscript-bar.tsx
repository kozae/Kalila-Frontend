import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { range } from 'lodash';
import { EditionStore } from '../store';
import { kalilaTheme } from '@frontend/shared-ui';
import { useContext, useMemo } from 'react';
import { ViewEditionContext, WIDTH_OPTIONS } from './view-edition-context';
import { letterMap } from '@frontend/util';

export interface IEditionManuscriptBarProps {
  manuscripts: number;
  store: EditionStore;
}

export const EditionManuscriptBar = ({
  manuscripts,
  store,
}: IEditionManuscriptBarProps) => {
  const { size } = useContext(ViewEditionContext);

  const fonSize = useMemo(() => {
    switch (size) {
      case 'xs':
        return '1rem';
      case 's':
        return '1.1rem';
      case 'm':
        return '1.2rem';
      case 'l':
        return '1.4rem';
      case 'xl':
        return '1.5rem';
    }
    return '1.5rem';
  }, [size]);

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
          <Typography p=".5rem" fontSize={fonSize} fontWeight={600}>
            ({letterMap[m]}) {store.get_ms_siglum(m)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
