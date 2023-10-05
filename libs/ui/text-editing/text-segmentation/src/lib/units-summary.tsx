import {
  insertUnit,
  kalilaTheme,
  selectAllUnitSummaries,
  selectCurrentPageNumber,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useContext } from 'react';
import { TextSegmentationContext } from './context';
import Button from '@mui/material/Button';
import axios from 'axios';
import { v4 } from 'uuid';

interface IFetchedSegment {
  segment: string;
  line: number;
  token: number;
  unit: string;
  bestGuess?: string;
  heuristic?: string;
}

function transformPipeline(data: IFetchedSegment[]): IFetchedSegment[] {
  // Step 1: Group by 'line'
  const groupedByLine = data.reduce((acc, item) => {
    if (!acc[item.line]) acc[item.line] = [];
    acc[item.line].push(item);
    return acc;
  }, {} as Record<number, IFetchedSegment[]>);

  // Step 2 & 3: Sort by 'token' and decrement the 'token'
  Object.values(groupedByLine).forEach((group) => {
    group.sort((a, b) => a.token - b.token);
    group.forEach((item, index) => {
      item.token -= index;
    });
  });

  // Step 4: Merge groups into one array
  return ([] as IFetchedSegment[]).concat(...Object.values(groupedByLine));
}

export const UnitsSummary = () => {
  const units = useAppSelector(selectAllUnitSummaries);
  const { hoveredUnit } = useContext(TextSegmentationContext);
  const pageNumber = useAppSelector(selectCurrentPageNumber);
  const dispatch = useAppDispatch();

  const fetchSegments = useCallback(async () => {
    const response = await axios.get<{
      segments: IFetchedSegment[];
      units: any;
    }>(`/api/get-segments/fol.${pageNumber}`);
    const { segments, units } = response.data;
    console.log(segments);
    console.log({ units });
    for (const item of transformPipeline(segments)) {
      if (item.bestGuess) {
        console.log({ guess: item, inserted: units[item.segment].Order });
      }

      if (item.heuristic) {
        console.log({ heuristic: item, inserted: units[item.segment].Order });
      }

      try {
        dispatch(
          insertUnit({
            Id: v4(),
            BookUnitId: item.segment,
            BookUnit: units[item.segment].Title,
            Order: units[item.segment].Order,
            FrameTags: units[item.segment].FrameTags,
            Type: 'n',
            Start: [pageNumber, item.line, item.token],
            End: [-1, -1, -1],
          })
        );
      } catch (e) {
        console.log({ error: item });
      }
    }
  }, [pageNumber]);
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: '100%',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
        pb: '5px',
        height: '3rem',
      }}
      justifyContent="center"
      alignItems="center"
    >
      {units.length === 0 && (
        <Typography p="5px" variant="h4">
          No units assigned
        </Typography>
      )}
      {hoveredUnit === undefined && (
        <Typography variant="h4">
          [ hover on a unit tag to reveal its name ]
        </Typography>
      )}
      {hoveredUnit && (
        <Typography key={hoveredUnit} p="5px" variant="h2">
          {hoveredUnit}
        </Typography>
      )}
      <Button onClick={() => fetchSegments()}>Fetch</Button>
    </Stack>
  );
};
