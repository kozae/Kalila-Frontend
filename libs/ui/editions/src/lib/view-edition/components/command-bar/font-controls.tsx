import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import { FONT_FAMILIES } from '../../constants';
import { useLayoutData, useLayoutDataMethods } from '../../contexts';
import { EditionFontFamily, EditionFontSize } from '@frontend/ui/editions';
import { useEffect } from 'react';
import { SxProps } from '@mui/system';

export const FontControls = ({ sx }: { sx?: SxProps }) => {
  const { size, font } = useLayoutData();
  const { setSize, setFont } = useLayoutDataMethods();

  const handleSizeChange = (event: any, newSize: EditionFontSize | null) => {
    setSize(newSize ?? 'xs');
  };

  const handleFontChange = (event: any, newFont: EditionFontFamily | null) => {
    setFont(newFont ?? 'n');
  };

  useEffect(() => console.log({ size }), [size]);

  return (
    <>
      <ToggleButtonGroup
        value={size}
        color="secondary"
        exclusive
        onChange={handleSizeChange}
        aria-label="text alignment"
        sx={sx}
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
        aria-label="font face"
        sx={sx}
      >
        <ToggleButton value="n" aria-label="small">
          <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['n']}>
            نوتو-نسخ
          </Typography>
        </ToggleButton>
        <ToggleButton value="a" aria-label="large">
          <Typography fontSize=".8rem" fontFamily={FONT_FAMILIES['a']}>
            أميري
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
