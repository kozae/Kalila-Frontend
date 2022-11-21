import dynamic from 'next/dynamic';
import {
  FacsimileCropper,
  loadFacsimileCropper,
  mapDataForCropper,
  useFacsimileCropper,
} from '@frontend/ui/facsimile-cropper';
import { FC, useEffect } from 'react';
import { hexToRgbUint32Array } from '@frontend/util';
import { AngleHelper } from '@frontend/ui/facsimile';
import Stack from '@mui/material/Stack';
import { kalilaTheme } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import { range } from 'lodash';
import { IImagePreviewData } from '@frontend/ui/editions';
import { EditionStore } from '../../../store';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants';
import { useData, useLayoutData } from '../../contexts';

export interface IDynamicImagePreviewProps {
  data: IImagePreviewData;
}

export const ImagePreviewContainer: FC<IDynamicImagePreviewProps> = ({
  data,
}) => {
  // TODO include caching
  return <ImagePreviewDynamic data={data} />;
};

export const ImagePreviewDynamic = dynamic<IDynamicImagePreviewProps>({
  loader: async () => {
    const cropper = await loadFacsimileCropper();
    return ({ data }) => {
      const { edition } = useData();
      const { manuscriptIdx, manuscriptSiglum, page, unitIdx } = data;
      const imageKey = `${manuscriptSiglum}_${unitIdx}`;
      const url = edition.get_url(`${manuscriptSiglum}_${page}`);
      const region = edition.get_image_region(manuscriptIdx, unitIdx);
      const tokenCount = edition.get_image_legend_token_count(
        manuscriptIdx,
        unitIdx
      );
      const tokens = tokenCount
        ? range(tokenCount).map(
            (idx) =>
              edition.get_image_legend_token(
                manuscriptIdx,
                unitIdx,
                idx
              ) as string
          )
        : undefined;
      let facsimileCropper: FacsimileCropper | null = null;
      useEffect(() => {
        return () => {
          if (facsimileCropper !== null) {
            facsimileCropper.free();
          }
        };
      }, []);
      if (region && url) {
        facsimileCropper = useFacsimileCropper(
          `${process.env['NEXT_PUBLIC_IMAGE_URL']}${url}`,
          cropper.FacsimileCropper.new
        );

        if (facsimileCropper) {
          const [p, r] = mapDataForCropper(region);
          const color = hexToRgbUint32Array('#6b9e1f');
          const preview = facsimileCropper.get_region(
            p,
            AngleHelper.normalizeRotationDeg(r),
            color,
            2.0
          );

          return (
            <ImagePreview url={preview} imageKey={imageKey} tokens={tokens} />
          );
        } else {
          return <h1>Loading...</h1>;
        }
      } else {
        return <h1>No preview available</h1>;
      }
    };
  },
  loading: () => <h1>Loading...</h1>,
  ssr: false,
});

export interface IBookUnitImagePreviewProps {
  unitIndex: number;
  msIndex: number;
  msSiglum: string;
  pageNumber: number;
  edition: EditionStore;
  color: string;
}

export const BookUnitImagePreviewDynamic = dynamic<IBookUnitImagePreviewProps>({
  loader: async () => {
    const cropper = await loadFacsimileCropper();
    return ({ unitIndex, msIndex, msSiglum, edition, pageNumber, color }) => {
      const imageKey = `${msSiglum}_${unitIndex}`;
      const url = edition.get_url(`${msSiglum}_${pageNumber}`);
      const region = edition.get_unit_image_region(msIndex, unitIndex);
      const tokenCount = edition.get_unit_image_legend_token_count(
        msIndex,
        unitIndex
      );
      const tokens = tokenCount
        ? range(tokenCount).map(
            (idx) =>
              edition.get_unit_image_legend_token(
                msIndex,
                unitIndex,
                idx
              ) as string
          )
        : undefined;
      let facsimileCropper: FacsimileCropper | null = null;
      useEffect(() => {
        return () => {
          if (facsimileCropper !== null) {
            facsimileCropper.free();
          }
        };
      }, []);
      if (region && url) {
        facsimileCropper = useFacsimileCropper(
          `${process.env['NEXT_PUBLIC_IMAGE_URL']}${url}`,
          cropper.FacsimileCropper.new
        );

        if (facsimileCropper) {
          const [p, r] = mapDataForCropper(region);
          const highlightColor = hexToRgbUint32Array(color ?? '#6b9e1f');
          const preview = facsimileCropper.get_region(
            p,
            AngleHelper.normalizeRotationDeg(r),
            highlightColor,
            2.0
          );

          return (
            <ImagePreview
              url={preview}
              imageKey={imageKey}
              tokens={tokens}
              color={color}
            />
          );
        } else {
          return <h1>Loading...</h1>;
        }
      } else {
        return <h1>No preview available</h1>;
      }
    };
  },
  loading: () => <h1>Loading...</h1>,
  ssr: false,
});

export const ImagePreview: FC<{
  url: string;
  imageKey: string;
  tokens?: string[];
  color?: string;
}> = ({ url, tokens, color }) => {
  const { size, font } = useLayoutData();

  return (
    <Stack bgcolor={color ?? 'none'} width="100%" height="100%">
      <img
        style={{
          maxWidth: '100%',
          minWidth: '50%',
          maxHeight: '85%',
          objectFit: 'contain',
          boxShadow: kalilaTheme.shadows[4],
        }}
        width="auto"
        height="auto"
        src={url}
        alt="Loading..."
      />
      <Stack
        width="100%"
        justifyContent="center"
        direction="row-reverse"
        flexWrap="wrap"
        bgcolor={color ?? 'primary.light'}
        boxShadow={kalilaTheme.shadows[4]}
      >
        {tokens && tokens.length !== 0 ? (
          tokens.map((t, i) => (
            <Typography
              p="3px"
              fontSize={FONT_SIZES[size]}
              fontFamily={FONT_FAMILIES[font]}
              key={i}
            >
              {t}
            </Typography>
          ))
        ) : (
          <Typography p="3px" fontSize={FONT_SIZES[size]}>
            No Legend Present
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
