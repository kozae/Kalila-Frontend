import Typography from '@mui/material/Typography';
import { FC, MouseEvent, useCallback } from 'react';
import { FONT_FAMILIES, FONT_SIZES } from '../../../constants';
import { EditionCellData } from '../../../../store';
import {
  useAuxiliarySurfacesMethods,
  useBehaviorOptions,
  useLayoutData,
  useSearchData,
} from '../../../contexts';
import { SxProps, Theme } from '@mui/system';

export interface ITokenProps {
  data: EditionCellData;
  index: number;
  msIndex: number;
  unitIndex: number;
}

export const Token: FC<ITokenProps> = ({ data, index, msIndex, unitIndex }) => {
  const { size, font } = useLayoutData();
  const { enableFacsimilePreview } = useBehaviorOptions();
  const { setActiveLinePreview } = useAuxiliarySurfacesMethods();
  const { currentSearchResult, searchResults } = useSearchData();
  const showLinePreview = useCallback(
    (tokenIndex: number, x: number, y: number) => {
      if (enableFacsimilePreview) {
        setActiveLinePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx: msIndex,
          page: data.get_page(tokenIndex),
          line: data.get_line(tokenIndex),
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

  const isCurrentSearchResult = useCallback(
    (tokenIndex: number) =>
      searchResults &&
      searchResults.length - 1 >= currentSearchResult &&
      searchResults[currentSearchResult][3] !== undefined &&
      searchResults[currentSearchResult][1] === msIndex &&
      searchResults[currentSearchResult][0] === unitIndex &&
      tokenIndex >= searchResults[currentSearchResult][2] &&
      tokenIndex <= searchResults[currentSearchResult][3]!,
    [currentSearchResult, searchResults, msIndex, unitIndex]
  );

  const isSearchResult = useCallback(
    (tokenIndex: number) =>
      searchResults &&
      searchResults.some(
        (res) =>
          res[3] !== undefined &&
          res[1] === msIndex &&
          res[0] === unitIndex &&
          tokenIndex >= res[2] &&
          tokenIndex <= res[3]
      ),
    [searchResults, msIndex, unitIndex]
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
    <Typography
      key={index}
      onMouseEnter={(e: MouseEvent<HTMLSpanElement>) =>
        showLinePreview(index, e.clientX, e.clientY)
      }
      onMouseLeave={hideLinePreview}
      fontSize={FONT_SIZES[size]}
      fontFamily={FONT_FAMILIES[font]}
      fontWeight="400"
      component="p"
      sx={tokenStyling(index)}
    >
      {data.get_token(index)}
    </Typography>
  );
};
