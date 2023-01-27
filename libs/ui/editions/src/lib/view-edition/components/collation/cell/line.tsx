import Typography from '@mui/material/Typography';
import { chain } from 'lodash';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { EditionCellData } from '../../../../store';
import {
  useAuxiliarySurfacesData,
  useAuxiliarySurfacesMethods,
  useBehaviorOptions,
  useSearchData,
} from '../../../contexts';

export interface ILineProps {
  data: EditionCellData;
  index: number;
  msIndex: number;
  msId: string;
  unitIndex: number;
}

interface ClassifiedTokens {
  type: 2 | 1 | 0; // 2=current search result, 1=search results, 0 for normal
  tokens: any[];
}

const searchResultsInLine = ({
  searchResults,
  currentSearchResult,
  msIndex,
  unitIndex,
  tokenIndexes,
}: any) =>
  searchResults
    ? chain(searchResults)
        .reduce((acc: any[], res: any, i: number) => {
          const start = tokenIndexes.indexOf(res[2]);
          const end = tokenIndexes.indexOf(res[3]);

          if (
            res[3] !== undefined && // i.e token search results, not row search result
            res[1] === msIndex &&
            res[0] === unitIndex &&
            (start !== -1 || end !== -1)
          ) {
            acc.push({ start, end, isCurrent: currentSearchResult === i });
          }
          return acc;
        }, [])
        .sortBy(['start'])
        .value()
    : [];

export const Line: FC<ILineProps> = ({
  data,
  index,
  msIndex,
  msId,
  unitIndex,
}) => {
  const { enableFacsimilePreview, editOnDoubleClick } = useBehaviorOptions();
  const { setActiveLinePreview } = useAuxiliarySurfacesMethods();
  const { activeLinePreview } = useAuxiliarySurfacesData();
  const { currentSearchResult, searchResults } = useSearchData();
  const tokens = data.get_tokens(index);
  const tokenIndexes = [...data.get_tokens_indexes(index)];
  const page = data.get_page(index);
  const line_number = data.get_line_number(index);
  const lineIsUnderPreview = useMemo(() => {
    return (
      activeLinePreview !== null &&
      activeLinePreview.manuscriptIdx === msIndex &&
      activeLinePreview.page === page &&
      activeLinePreview.line === line_number
    );
  }, [activeLinePreview]);
  const showLinePreview = useCallback(
    (x: number, y: number) => {
      if (enableFacsimilePreview) {
        setActiveLinePreview({
          manuscriptSiglum: data.get_manuscript_siglum(),
          manuscriptIdx: msIndex,
          page: page,
          line: line_number,
          x,
          y,
        });
      }
    },
    [enableFacsimilePreview]
  );

  const hideLinePreview = useCallback(() => {
    if (enableFacsimilePreview) {
      setActiveLinePreview(null);
    }
  }, [enableFacsimilePreview]);

  const classifiedTokens: ClassifiedTokens[] = useMemo(() => {
    const results = searchResultsInLine({
      searchResults,
      currentSearchResult,
      msIndex,
      unitIndex,
      tokenIndexes,
    });
    if (results.length !== 0) {
      const classified: ClassifiedTokens[] = [];

      results.forEach((resultItem, i) => {
        if (i === 0 && resultItem.start !== 0) {
          // tokens before the first search result
          classified.push({
            type: 0,
            tokens: tokens.slice(0, resultItem.start),
          });
        }

        classified.push({
          // tokens in the search results
          type: resultItem.isCurrent ? 2 : 1,
          tokens: tokens.slice(resultItem.start, resultItem.end + 1),
        });

        if (
          i <= results.length - 2 &&
          resultItem.end < results[i + 1].start - 1
        ) {
          // tokens between search results
          classified.push({
            type: 0,
            tokens: tokens.slice(resultItem.end + 1, results[i + 1].start - 1),
          });
        }

        if (i === results.length - 1) {
          // tokens after the final search result
          if (resultItem.end <= tokens.length - 2) {
            classified.push({
              type: 0,
              tokens: tokens.slice(resultItem.end + 1),
            });
          }
        }
      });
      return classified;
    }

    return [
      {
        type: 0,
        tokens,
      },
    ];
  }, [
    currentSearchResult,
    searchResults,
    msIndex,
    unitIndex,
    tokenIndexes,
    tokens,
  ]);

  return (
    <Typography
      key={index}
      onMouseEnter={(e: MouseEvent<HTMLSpanElement>) =>
        showLinePreview(e.clientX, e.clientY)
      }
      onMouseLeave={hideLinePreview}
      onDoubleClick={() => {
        if (editOnDoubleClick) {
          window.open(
            `/text-editing-find?manuscript=${msId}&page=${page}`,
            '_blank'
          );
        }
      }}
      variant="inherit"
      sx={
        enableFacsimilePreview
          ? {
              p: '3px',
              color: lineIsUnderPreview ? 'white' : 'inherit',
              bgcolor: lineIsUnderPreview ? 'info.dark' : 'inherit',
              borderRadius: '5px',
              '&:hover': { bgcolor: 'info.dark', color: 'white' },
            }
          : { p: '3px', color: 'inherit', borderRadius: '5px' }
      }
      component="span"
    >
      {classifiedTokens.map((group, i) => {
        if (group.type === 1) {
          // search result
          return (
            <Typography
              key={i}
              className="ser"
              component="span"
              bgcolor="rgba(255,103,0, 0.3)"
              variant="inherit"
            >
              {group.tokens.join(' ') + ' '}
            </Typography>
          );
        }
        if (group.type === 2) {
          // current search result
          return (
            <Typography
              key={i}
              className="curser"
              component="span"
              bgcolor="rgb(255,103,0)"
              variant="inherit"
            >
              {group.tokens.join(' ') + ' '}
            </Typography>
          );
        }
        return (
          // normal tokens
          <Typography key={i} component="span" variant="inherit">
            {group.tokens.join(' ') + ' '}
          </Typography>
        );
      })}
    </Typography>
  );
};
