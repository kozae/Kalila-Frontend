import { FC } from 'react';
import { ICategoricalAttribute, IImageElement } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import { AnnotateImage } from './annotate-image';
import useSWR from 'swr';
import { paramsSerializer } from '@frontend/util';
import { ApiClient } from '@frontend/shared-ui';

export const EditImages: FC<{ data: IImageElement[] }> = ({ data }) => {
  const { data: attributes } = useSWR(
    'ImageElementsCategoricalAttributes',
    () =>
      ApiClient()
        .get<ICategoricalAttribute[]>(
          `${process.env['NEXT_PUBLIC_API_URL']}CategoricalAttribute`,
          {
            paramsSerializer: { serialize: paramsSerializer },
            params: {
              EntityNameCn: 'ImageElement',
              PageSize: -1,
            },
            headers: {},
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
