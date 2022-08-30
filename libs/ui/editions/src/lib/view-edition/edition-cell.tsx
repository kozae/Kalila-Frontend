import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { EditionCellData } from '../store';
import { range } from 'lodash';
import { useCallback, MouseEvent } from 'react';
import { SxProps, Theme, ResponsiveStyleValue } from '@mui/system';
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import {
  useBehaviorOptions,
  useBehaviorOptionsMethods,
  useLayoutOptions,
  useSearchData,
} from './contexts';
import { FONT_FAMILIES, FONT_SIZES } from './constants';

export interface IEditionCellProps {
  data: EditionCellData;
  style: SxProps<Theme>;
  direction?: ResponsiveStyleValue<
    'row' | 'column' | 'column-reverse' | 'row-reverse'
  >;
  flexWrap: string;
}

export const EditionCell = ({
  data,
  style,
  direction,
  flexWrap,
}: IEditionCellProps) => {
  const count = data.get_token_count();
  const unit_idx = data.get_unit_idx();
  const manuscript_unit_order = data.get_unit_order();
  const imageLocation = data.get_located_image_location();
  const manuscriptIdx = data.get_manuscript_idx();
  const { size, font } = useLayoutOptions();
  const { enableFacsimilePreview } = useBehaviorOptions();
  const { setActiveLinePreview, setActiveImagePreview } =
    useBehaviorOptionsMethods();
  const { currentSearchResult, searchResults } = useSearchData();

  const showLinePreview = useCallback(
    (tokenIndex: number, x: number, y: number) => {
      if (enableFacsimilePreview) {
        setActiveLinePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx,
          page: data.get_page(tokenIndex),
          line: data.get_line(tokenIndex),
          x,
          y,
        });
      }
    },
    [data, enableFacsimilePreview]
  );

  const showImagePreview = useCallback(
    (tokenIndex: number, x: number, y: number) => {
      if (enableFacsimilePreview) {
        setActiveImagePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx,
          page: data.get_page(tokenIndex),
          unitIdx: data.get_unit_idx() as number,
          x,
          y,
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

  const hideImagePreview = useCallback(() => {
    if (enableFacsimilePreview) {
      setActiveImagePreview(null);
    }
  }, [enableFacsimilePreview]);

  if (count === 0) {
    return (
      <Stack sx={style} alignItems="center" justifyContent="center">
        <Typography align="right" fontSize="1rem" variant="body2">
          [ absent ]
        </Typography>
      </Stack>
    );
  }

  const isCurrentSearchResult = useCallback(
    (tokenIndex: number) =>
      searchResults &&
      searchResults.length - 1 >= currentSearchResult &&
      searchResults[currentSearchResult][3] !== undefined &&
      searchResults[currentSearchResult][1] === manuscriptIdx &&
      searchResults[currentSearchResult][0] === unit_idx &&
      tokenIndex >= searchResults[currentSearchResult][2] &&
      tokenIndex <= searchResults[currentSearchResult][3]!,
    [currentSearchResult, searchResults, manuscriptIdx, unit_idx]
  );

  const isSearchResult = useCallback(
    (tokenIndex: number) =>
      searchResults &&
      searchResults.some(
        (res) =>
          res[3] !== undefined &&
          res[1] === manuscriptIdx &&
          res[0] === unit_idx &&
          tokenIndex >= res[2] &&
          tokenIndex <= res[3]
      ),
    [searchResults, manuscriptIdx, unit_idx]
  );

  const tokenStyling: (index: number) => SxProps<Theme> = useCallback(
    (tokenIndex: number) => {
      const bgcolor = isCurrentSearchResult(tokenIndex)
        ? 'rgb(255,103,0)'
        : isSearchResult(tokenIndex)
        ? 'rgba(255,103,0, 0.3)'
        : 'inherit';
      const color = isCurrentSearchResult(tokenIndex) ? 'white' : 'black';
      if (enableFacsimilePreview) {
        return {
          p: '3px',
          borderRadius: '5px',
          bgcolor,
          color,
          '&:hover': {
            bgcolor: 'info.dark',
            color: 'white',
          },
        };
      } else {
        return { p: '3px', bgcolor, borderRadius: '5px', color };
      }
    },
    [enableFacsimilePreview, isCurrentSearchResult, isSearchResult]
  );

  return (
    <Box sx={style}>
      <Stack
        alignItems="flex-start"
        justifyContent="space-evenly"
        direction={direction ?? 'row-reverse'}
        sx={{
          flexWrap,
        }}
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
          range(count).map((index) =>
            imageLocation != index ? (
              <Typography
                key={index}
                onMouseEnter={(e: MouseEvent<HTMLSpanElement>) =>
                  showLinePreview(index, e.clientX, e.clientY)
                }
                onMouseLeave={hideLinePreview}
                fontSize={FONT_SIZES[size]}
                fontFamily={FONT_FAMILIES[font]}
                component="p"
                sx={tokenStyling(index)}
              >
                {data.get_token(index)}
              </Typography>
            ) : (
              <Stack alignItems="baseline" direction="row" key={index}>
                <Typography
                  key={index}
                  onMouseEnter={(e: MouseEvent<HTMLSpanElement>) =>
                    showLinePreview(index, e.clientX, e.clientY)
                  }
                  onMouseLeave={hideLinePreview}
                  fontSize={FONT_SIZES[size]}
                  fontFamily={FONT_FAMILIES[font]}
                  component="p"
                  sx={tokenStyling(index)}
                >
                  {data.get_token(index)}
                </Typography>
                <ImageTwoToneIcon
                  onMouseLeave={hideImagePreview}
                  onMouseEnter={(e: MouseEvent<SVGSVGElement>) =>
                    showImagePreview(index, e.clientX, e.clientY)
                  }
                  sx={{ fontSize: FONT_SIZES[size], ...tokenStyling(-1) }}
                />
              </Stack>
            )
          )}

        <Box sx={{ flexGrow: 1 }} />
      </Stack>
    </Box>
  );
};
