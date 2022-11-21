import { FC } from 'react';
import { IImageElement } from '@frontend/domain';
import useSWR from 'swr';
import {
  ApiClient,
  selectCurrentPageManuscriptId,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';

export const ImageLegendAssignment: FC<{
  el: IImageElement;
}> = ({ el }) => {
  const manuscriptId = useAppSelector(selectCurrentPageManuscriptId);
  const { data: legendData, isValidating } = useSWR(
    manuscriptId && el.LegendId,
    () =>
      ApiClient()
        .get(
          `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/TextElements`,
          {
            params: {
              Id: manuscriptId,
              ManuscriptId: manuscriptId,
              TextElementId: el.LegendId,
            },
            headers: {},
          }
        )
        .then((res) => res.data)
  );

  const onAssignLegend = () => {};

  return (
    <Stack>
      <Button onClick={onAssignLegend}>
        {el.LegendId ? 'Change assigned legend' : 'Assign Legend'}
      </Button>
    </Stack>
  );
};
