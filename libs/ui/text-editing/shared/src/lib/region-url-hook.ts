import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import useSWR from 'swr';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';
import { hexToRgbUint32Array } from '@frontend/util';
import { IFacsimileRegion } from '@frontend/domain';

export function useRegionUrl(
  id?: string | null,
  region?: (IFacsimileRegion & { HighlightColor?: string }) | null
) {
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const { data: url } = useSWR(id, () => {
    if (region) {
      const [p, r] = mapDataForCropper(region);
      const color = hexToRgbUint32Array(region.HighlightColor ?? '#6b9e1f');
      return facsimileCropper?.get_region(p, r, color);
    }

    return undefined;
  });
  return url;
}
