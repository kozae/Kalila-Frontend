import dynamic from 'next/dynamic';
import {
  FacsimileCropper,
  loadFacsimileCropper,
  mapDataForCropper,
  useFacsimileCropper,
} from '@frontend/ui/facsimile-cropper';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { hexToRgbUint32Array } from '@frontend/util';
import { AngleHelper } from '@frontend/ui/facsimile';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { kalilaTheme } from '@frontend/shared-ui';
import { ILinePreviewData } from '@frontend/ui/editions';

import { useData, useDataMutators } from '../../contexts';

export interface IDynamicLinePreviewProps {
  data: ILinePreviewData;
}

export const LinePreviewContainer: FC<IDynamicLinePreviewProps> = ({
  data,
}) => {
  const lineKey = `${data.manuscriptSiglum}_${data.page}_${data.line}`;
  const { previewCache } = useData();
  if (previewCache[lineKey]) {
    return <LinePreview url={previewCache[lineKey]} lineKey={lineKey} />;
  } else {
    return <LinePreviewDynamic data={data} />;
  }
};

export const LinePreviewDynamic = dynamic<IDynamicLinePreviewProps>({
  loader: async () => {
    const cropper = await loadFacsimileCropper();
    return ({ data }) => {
      const { manuscriptSiglum, page, line } = data;
      const { edition } = useData();
      const { setPreviewCache } = useDataMutators();
      const lineKey = `${manuscriptSiglum}_${page}_${line}`;
      const url = edition.get_url(`${manuscriptSiglum}_${page}`);
      const region = edition.get_line_region(lineKey);
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
            8.0
          );

          return (
            <LinePreview
              url={preview}
              lineKey={lineKey}
              setLinePreviews={setPreviewCache}
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

export const LinePreview: FC<{
  url: string;
  lineKey: string;
  setLinePreviews?: Dispatch<SetStateAction<Record<string, string>>>;
}> = ({ url, lineKey, setLinePreviews }) => {
  useEffect(() => {
    if (setLinePreviews && url && lineKey) {
      setLinePreviews((prev) => {
        return { ...prev, [lineKey]: url };
      });
    }
  }, [url, lineKey, setLinePreviews]);

  const lineInfo = lineKey.split('_');

  return (
    <Stack
      bgcolor="primary.light"
      boxShadow={kalilaTheme.shadows[4]}
      width="100%"
      height="100%"
    >
      <Typography
        variant="h3"
        width="100%"
        textAlign="center"
        color="white"
        borderRadius="5px 5px 0 0"
        p="5px"
      >
        Manuscript: {lineInfo[0]}, Page: {lineInfo[1]}, Line: {lineInfo[2]}
      </Typography>
      <img
        style={{
          maxWidth: '100%',
          minWidth: '50%',
          maxHeight: '85%',
          objectFit: 'contain',
        }}
        width="auto"
        height="auto"
        src={url}
        alt="Loading..."
      />
    </Stack>
  );
};
