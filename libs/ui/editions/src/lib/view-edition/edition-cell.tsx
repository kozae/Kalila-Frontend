import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { EditionCellData } from '../store';
import { range } from 'lodash';
import { useCallback, useContext, useMemo } from 'react';
import {
  FONT_FAMILIES,
  WIDTH_OPTIONS,
  ViewEditionContext,
  FONT_SIZES,
} from './view-edition-context';

export interface IEditionCellProps {
  data: EditionCellData;
  bgcolor: 'white' | '#F1F1F1';
}

export const EditionCell = ({ data, bgcolor }: IEditionCellProps) => {
  const count = data.get_token_count();
  const unit_idx = data.get_unit_idx();
  const manuscript_unit_order = data.get_unit_order();

  const { size, font, enableFacsimilePreview, setActiveLinePreview } =
    useContext(ViewEditionContext);

  const showLinePreview = useCallback(
    (tokenIndex: number) => {
      if (enableFacsimilePreview) {
        setActiveLinePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx: data.get_manuscript_idx(),
          page: data.get_page(tokenIndex),
          line: data.get_line(tokenIndex),
        });
      }
    },
    [data, enableFacsimilePreview]
  );

  const hideLinePreview = useCallback(() => {
    if (enableFacsimilePreview) {
      setActiveLinePreview(null);
    }
  }, [enableFacsimilePreview]);

  const style = {
    width: useMemo(() => `${WIDTH_OPTIONS[size]}px`, [size]),
    p: '5px',
    minHeight: '50px',
    bgcolor,
    borderRadius: '5px',
  };
  if (count === 0) {
    return (
      <Stack sx={style} alignItems="center" justifyContent="center">
        <Typography align="right" fontSize="1rem" variant="body2">
          [ absent ]
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={style}>
      <Stack
        alignItems="flex-start"
        justifyContent="space-evenly"
        direction="row-reverse"
        flexWrap="wrap"
      >
        {manuscript_unit_order !== unit_idx && (
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

        {unit_idx !== undefined &&
          range(count).map((index) => (
            <Typography
              key={index}
              onMouseEnter={() => showLinePreview(index)}
              onMouseLeave={hideLinePreview}
              fontSize={FONT_SIZES[size]}
              fontFamily={FONT_FAMILIES[font]}
              component="p"
              sx={{
                p: '3px',
              }}
            >
              {data.get_token(index)}
            </Typography>
          ))}

        <Box sx={{ flexGrow: 1 }} />
      </Stack>
    </Box>
  );
};
