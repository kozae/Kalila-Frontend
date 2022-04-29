import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ChangeEvent, useContext } from 'react';
import {
  EditionFontFamily,
  EditionFontSize,
  FONT_FAMILIES,
  ViewEditionContext,
} from './view-edition-context';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

export const EditionCommandBar = () => {
  const {
    size,
    setSize,
    font,
    setFont,
    facsimilePreview,
    setFacsimilePreview,
    realTimeUpdates,
    setRealTimeUpdates,
    structureViz,
    setStructureViz,
  } = useContext(ViewEditionContext);

  const handleSizeChange = (event: any, newSize: EditionFontSize | null) => {
    setSize(newSize ?? 's');
  };

  const handleFontChange = (event: any, newFont: EditionFontFamily | null) => {
    setFont(newFont ?? 'n');
  };

  const handleFacsimilePreviewChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFacsimilePreview(event.target.checked);
  };

  const handleRealTimeUpdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRealTimeUpdates(event.target.checked);
  };

  const handleStructureVizChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStructureViz(event.target.checked);
  };

  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 0,
        height: '110px',
        width: '100%',
        zIndex: 60,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        sx={{
          maxWidth: '1600px',
          bgcolor: 'white',
          height: '60px',
          width: '100%',
          boxShadow:
            '0 25.6px 57.6px 0 rgba(0, 0, 0, 0.22), 0 4.8px 14.4px 0 rgba(0, 0, 0, 0.18)',
        }}
        direction="row"
      ></Stack>
      <Stack
        sx={{
          maxWidth: '1600px',
          bgcolor: 'white',
          height: '50px',
          width: '100%',
          pt: '2px',
          pb: '2px',
        }}
        direction="row"
      >
        <Stack
          marginLeft="5px"
          spacing={0.5}
          alignItems="center"
          direction="row"
        >
          <ToggleButtonGroup
            value={size}
            color="secondary"
            exclusive
            onChange={handleSizeChange}
            aria-label="text alignment"
          >
            <ToggleButton value="xs" aria-label="x-small">
              <Typography fontSize=".8rem">XS</Typography>
            </ToggleButton>
            <ToggleButton value="s" aria-label="small">
              <Typography fontSize=".8rem">S</Typography>
            </ToggleButton>
            <ToggleButton value="m" aria-label="medium">
              <Typography fontSize=".8rem">M</Typography>
            </ToggleButton>
            <ToggleButton value="l" aria-label="large">
              <Typography fontSize=".8rem">L</Typography>
            </ToggleButton>
            <ToggleButton value="xl" aria-label="x-large">
              <Typography fontSize=".8rem">XL</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={font}
            color="secondary"
            exclusive
            onChange={handleFontChange}
            aria-label="text alignment"
          >
            <ToggleButton value="n" aria-label="small">
              <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['n']}>
                نوتو-نسخ
              </Typography>
            </ToggleButton>
            <ToggleButton value="sh" aria-label="medium">
              <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['sh']}>
                شهرزاد
              </Typography>
            </ToggleButton>
            <ToggleButton value="a" aria-label="large">
              <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['a']}>
                أميري
              </Typography>
            </ToggleButton>
            <ToggleButton value="m" aria-label="x-large">
              <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['m']}>
                ميرزا
              </Typography>
            </ToggleButton>
            <ToggleButton value="ns" aria-label="x-large">
              <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['ns']}>
                نوتو-سنس
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack marginLeft="10px" direction="row" alignItems="center">
          <Typography fontSize=".8rem">Structure visualization</Typography>
          <Switch checked={structureViz} onChange={handleStructureVizChange} />
        </Stack>
        <Stack marginLeft="10px" direction="row" alignItems="center">
          <Typography fontSize=".8rem">Preview facsimile on hover</Typography>
          <Switch
            checked={facsimilePreview}
            onChange={handleFacsimilePreviewChange}
          />
        </Stack>
        <Stack marginLeft="10px" direction="row" alignItems="center">
          <Typography fontSize=".8rem">Real-time updates</Typography>
          <Switch
            checked={realTimeUpdates}
            onChange={handleRealTimeUpdateChange}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
