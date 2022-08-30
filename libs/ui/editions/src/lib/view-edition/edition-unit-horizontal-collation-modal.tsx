import { EditionCellData } from '../store';
import { FC } from 'react';
import { SxProps } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EditionCell } from './edition-cell';
import Box from '@mui/material/Box';
import { DialogHeading } from '@frontend/shared-ui';
import { useLayoutOptions } from './contexts';
import { EditionFontSize } from './models';
export interface IUnitHorizontalCollationProps {
  unitTitle: string;
  sigla: string[];
  data: EditionCellData[];
  onDismiss: () => void;
}

export const horizontalCollationModalStyle: (showNavbar: boolean) => SxProps = (
  showNavbar
) => ({
  position: 'absolute' as 'absolute',
  top: showNavbar ? '110px' : '50px',
  right: '100px',
  height: 'fit-content',
  maxHeight: '100vh',
  width: 'calc(100vw - 200px)',
  boxShadow: 24,
  borderRadius: '10px',
});

const HEIGHT: Record<EditionFontSize, string> = {
  xs: '40px',
  s: '50px',
  m: '55px',
  l: '65px',
  xl: '80px',
};

export const UnitHorizontalCollationModal: FC<
  IUnitHorizontalCollationProps
> = ({ data, sigla, unitTitle, onDismiss }) => {
  const { size } = useLayoutOptions();
  const height = HEIGHT[size];
  return (
    <Stack width="100%" height="fit-content" maxHeight="100vh">
      <DialogHeading color="info.light" onDismiss={onDismiss}>
        <Typography fontSize="1.3rem" color="white">
          {unitTitle}
        </Typography>
      </DialogHeading>
      <Stack direction="row-reverse" width="100%">
        <Stack borderLeft="dotted black 2px" width="10%">
          {sigla.map((siglum, index) => (
            <Typography
              key={siglum}
              bgcolor={index % 2 === 0 ? 'white' : '#F1F1F1'}
              variant="h3"
              p="1rem"
              height={height}
              textAlign="center"
              sx={{
                verticalAlign: 'center',
              }}
            >
              {siglum}
            </Typography>
          ))}
        </Stack>
        <Box width="90%" sx={{ overflowX: 'scroll', direction: 'rtl' }}>
          <Stack minWidth="100%" width="fit-content">
            {sigla.map((siglum, index) => (
              <EditionCell
                key={siglum}
                style={{
                  height,
                  bgcolor: index % 2 === 0 ? 'white' : '#F1F1F1',
                  display: 'flex',
                  alignItems: 'center',
                }}
                data={data[index]}
                flexWrap="nowrap"
                direction="row"
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};
