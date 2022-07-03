import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import useSWR from 'swr';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';
import { hexToRgbUint32Array } from '@frontend/util';
import { FacsimileRegion } from '@frontend/domain';

export function useRegionUrl(
  id?: string | null,
  region?: {
    Id: string;
    HighlightColor: string | undefined;
    Text?: string;
    Region: FacsimileRegion;
  } | null
) {
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const { data: url } = useSWR(id, () => {
    if (region) {
      const [p, r] = mapDataForCropper(region.Region);
      const color = hexToRgbUint32Array(region.HighlightColor ?? '#6b9e1f');
      return facsimileCropper?.get_region(p, r, color);
    }

    return undefined;
  });
  return url;
}
