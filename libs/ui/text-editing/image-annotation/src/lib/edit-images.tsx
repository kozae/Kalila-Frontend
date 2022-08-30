import { FC, useEffect } from 'react';
import { ICategoricalAttribute, IImageElement } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import { AnnotateImage } from './annotate-image';
import useSWR from 'swr';
import axios from 'axios';
import { selectAccessToken, useAppSelector } from '@frontend/shared-ui';
import { paramsSerializer } from '@frontend/util';

export const EditImages: FC<{ data: IImageElement[] }> = ({ data }) => {
  const accessToken = useAppSelector(selectAccessToken);
  const { data: attributes } = useSWR(
    accessToken && 'ImageElementsCategoricalAttributes',
    () =>
      axios
        .get<ICategoricalAttribute[]>(
          `${process.env['NEXT_PUBLIC_API_URL']}CategoricalAttribute`,
          {
            paramsSerializer,
            params: {
              EntityNameCn: 'ImageElement',
              PageSize: -1,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) =>
          res.data.reduce((prev, { FieldName, Option }) => {
            if (prev[FieldName]) {
              prev[FieldName].push(Option);
            } else {
              prev[FieldName] = [Option];
            }
            return prev;
          }, {} as Record<string, string[]>)
        )
  );

  return (
    <Stack>
      {data.map((el) => (
        <AnnotateImage key={el.Id} el={el} attributes={attributes} />
      ))}
    </Stack>
  );
};
