import { FC } from 'react';
import { IImageElement } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import { ImageElementSummary } from './image-element-summary';

export const ViewImages: FC<{ data: IImageElement[] }> = ({ data }) => {
  return (
    <Stack alignItems="center">
      {data.map((el) => (
        <ImageElementSummary key={el.Id} el={el} />
      ))}
    </Stack>
  );
};
