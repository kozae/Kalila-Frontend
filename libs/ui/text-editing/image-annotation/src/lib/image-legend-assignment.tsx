import { FC, useEffect } from 'react';
import { IImageElement } from '@frontend/domain';
import useSWR from 'swr';
import axios from 'axios';
import {
  selectAccessToken,
  selectCurrentPageManuscriptId,
  updateImageElement,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';

export const ImageLegendAssignment: FC<{
  el: IImageElement;
}> = ({ el }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const manuscriptId = useAppSelector(selectCurrentPageManuscriptId);
  const { data: legendData, isValidating } = useSWR(
    accessToken && manuscriptId && el.LegendId,
    () =>
      axios
        .get(
          `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/TextElements`,
          {
            params: {
              Id: manuscriptId,
              ManuscriptId: manuscriptId,
              TextElementId: el.LegendId,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
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
