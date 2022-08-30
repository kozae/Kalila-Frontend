import React, { FC } from 'react';
import { FacsimileRegion, IImageElement } from '@frontend/domain';
import {
  onRegionHoveredInToolSpace,
  useAppDispatch,
} from '@frontend/shared-ui';
import { useRegionUrl } from '@frontend/ui/text-editing/shared';
import Box from '@mui/material/Box';
import { hexToRgba } from '@frontend/util';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { ImageLegendAssignment } from './image-legend-assignment';
import { ImageUnitAssignment } from './image-unit-assignment';

export interface IAnnotateImageProps {
  el: IImageElement;
  attributes?: Record<string, string[]>;
}

export const AnnotateImage: FC<IAnnotateImageProps> = ({ el, attributes }) => {
  const dispatch = useAppDispatch();
  const url = useRegionUrl(
    el.Id,
    el.FacsimileRegion
      ? {
          Id: el.Id,
          Region: el.FacsimileRegion,
          HighlightColor: el.HighlightColor,
        }
      : undefined
  );

  const handleHover = (
    region: { Region: FacsimileRegion; Id: string } | null
  ) => dispatch(onRegionHoveredInToolSpace(region));

  return (
    <Stack alignItems="center" width="90%">
      <Box
        sx={{
          width: '100%',
          bgcolor: hexToRgba(el.HighlightColor as string, 0.4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          onMouseEnter={() =>
            handleHover({
              Region: el.FacsimileRegion,
              Id: el.Id,
            } as { Region: FacsimileRegion; Id: string })
          }
          onMouseLeave={() => handleHover(null)}
          style={{
            maxWidth: '100%',
            minWidth: '50%',
            maxHeight: '40vh',
            objectFit: 'contain',
            margin: '1vh 0.5vw 1vh 0.5vw',
          }}
          width="auto"
          height="auto"
          src={url}
          alt="region not defined"
        />
      </Box>
      <Stack>
        <ImageLegendAssignment el={el} />
        <ImageUnitAssignment el={el} />
      </Stack>
    </Stack>
  );
};
