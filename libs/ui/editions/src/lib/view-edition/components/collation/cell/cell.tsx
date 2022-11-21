import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { range } from 'lodash';
import { Fragment, useEffect, useMemo } from 'react';
import { SxProps, Theme, ResponsiveStyleValue } from '@mui/system';
import { useBehaviorOptions, useData, useLayoutData } from '../../../contexts';
import { FONT_SIZES } from '../../../constants';
import { Token } from './token';
import { LocatedImage } from './located-image';
import { PageBreak } from './page-break';
import { kalilaTheme } from '@frontend/shared-ui';

export interface IEditionCellProps {
  unitIndex: number;
  msIndex: number;
  style: SxProps<Theme>;
  direction?: ResponsiveStyleValue<
    'row' | 'column' | 'column-reverse' | 'row-reverse'
  >;
  flexWrap: string;
}

export const Cell = ({
  style,
  direction,
  flexWrap,
  unitIndex,
  msIndex,
}: IEditionCellProps) => {
  const { visibleUnitInfo } = useBehaviorOptions();
  const { cells, edition } = useData();
  const data = cells[unitIndex][msIndex];
  const count = data.get_token_count();
  const manuscript_unit_order = data.get_unit_order();
  const imageLocation = data.get_located_image_location();
  const { size } = useLayoutData();
  const isLacuna = edition.is_unit_lacuna(msIndex, unitIndex);
  const unitRange = [...data.get_page_range()];

  if (count === 0) {
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
      {count !== 0 && unitIndex === visibleUnitInfo && (
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
        alignItems="flex-start"
        justifyContent="space-evenly"
        direction={direction ?? 'row-reverse'}
        sx={{
          flexWrap,
        }}
      >
        {manuscript_unit_order !== unitIndex && (
          <Typography
            key={'order'}
            fontSize={FONT_SIZES[size]}
            component="p"
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

        {unitIndex !== undefined &&
          range(count).map((index) => (
            <Fragment key={index}>
              {data.is_first_token(index) && (
                <PageBreak index={index} data={data} msIndex={msIndex} />
              )}
              <Token
                index={index}
                data={data}
                msIndex={msIndex}
                unitIndex={unitIndex}
              />

              {imageLocation === index && (
                <LocatedImage index={index} data={data} msIndex={msIndex} />
              )}
            </Fragment>
          ))}

        <Box sx={{ flexGrow: 1 }} />
      </Stack>
    </Box>
  );
};
