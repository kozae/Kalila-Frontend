import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Fragment } from 'react';
import { SxProps, Theme, ResponsiveStyleValue } from '@mui/system';
import { useBehaviorOptions, useData, useLayoutData } from '../../../contexts';
import { FONT_SIZES, LINE_HEIGHTS, FONT_FAMILIES } from '../../../constants';
import { LocatedImage } from './located-image';
import { PageBreak } from './page-break';
import { Line } from './line';

export interface IEditionCellProps {
  unitIndex: number;
  msIndex: number;
  style: SxProps<Theme>;
  direction?: ResponsiveStyleValue<
    'row' | 'column' | 'column-reverse' | 'row-reverse'
  >;
  flexWrap: string;
  alignItems?: string;
}

export const Cell = ({
  style,
  direction,
  flexWrap,
  unitIndex,
  msIndex,
  alignItems,
}: IEditionCellProps) => {
  const { visibleUnitInfo } = useBehaviorOptions();
  const { cells, edition } = useData();
  const data = cells[unitIndex][msIndex];
  const lines = [...data.get_lines()];

  const manuscript_unit_order = data.get_unit_order();
  const imageLocation = data.get_located_image_location();
  const { size, font } = useLayoutData();
  const isLacuna = edition.is_unit_lacuna(msIndex, unitIndex);
  const msId = edition.get_ms_id(msIndex);
  const unitRange = [...data.get_page_range()];

  if (lines.length === 0) {
    return (
      <Stack sx={style} alignItems="center" justifyContent="center">
        <Typography fontSize={FONT_SIZES[size]} align="right" variant="body2">
          {isLacuna ? ' [ possible lacuna ]' : ' [ absent ]'}
        </Typography>
      </Stack>
    );
  }

  return (
    <Box position="relative" sx={style}>
      {lines.length === 0 && unitIndex === visibleUnitInfo && (
        <Box position="absolute" top={0} left={0} sx={style}>
          {unitRange[0] === unitRange[2] ? (
            <Typography fontSize={FONT_SIZES[size]}>
              P: {unitRange[0]},{' '}
              {unitRange[1] !== unitRange[3]
                ? `L: ${unitRange[1]} to ${unitRange[3]}`
                : `L: ${unitRange[1]}`}
            </Typography>
          ) : (
            <Typography fontSize={FONT_SIZES[size]}>
              P: {unitRange[0]} L: {unitRange[1]}, to P: {unitRange[2]} L:{' '}
              {unitRange[3]}
            </Typography>
          )}
        </Box>
      )}
      <Stack
        alignItems={alignItems ?? 'flex-start'}
        justifyContent="space-evenly"
        direction={direction ?? 'column'}
        sx={{
          flexWrap,
        }}
      >
        {unitIndex !== undefined && (
          <Typography
            component="p"
            lineHeight={LINE_HEIGHTS[size]}
            fontSize={FONT_SIZES[size]}
            fontFamily={FONT_FAMILIES[font]}
            fontWeight="400"
            sx={{ direction: 'rtl', textAlign: 'justify' }}
          >
            {manuscript_unit_order !== unitIndex && (
              <Typography
                key={'order'}
                fontSize={FONT_SIZES[size]}
                component="span"
                fontWeight="600"
                sx={{
                  p: '3px',
                  bgcolor: 'secondary.light',
                  color: 'white',
                  borderRadius: '5px',
                }}
              >
                {data.get_unit_order()}
              </Typography>
            )}
            {lines.map((index) => (
              <Fragment key={index}>
                {data.is_first_token(index) && (
                  <PageBreak index={index} data={data} msIndex={msIndex} />
                )}
                <Line
                  index={index}
                  data={data}
                  msIndex={msIndex}
                  msId={msId}
                  unitIndex={unitIndex}
                />

                {imageLocation === index && (
                  <LocatedImage index={index} data={data} msIndex={msIndex} />
                )}
              </Fragment>
            ))}
          </Typography>
        )}

        <Box sx={{ height: '1px', width: '100%' }} />
      </Stack>
    </Box>
  );
};
