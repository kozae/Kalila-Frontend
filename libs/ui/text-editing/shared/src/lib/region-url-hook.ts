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
    HighlightColor?: string | undefined;
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

export function useManyRegionsUrl(
  regions: {
    Id: string;
    HighlightColor?: string | undefined;
    Text?: string;
    Region: FacsimileRegion;
  }[]
) {
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const result: Record<string, string> = {};

  for (const region of regions) {
    if (region && facsimileCropper) {
      const [p, r] = mapDataForCropper(region.Region);
      const color = hexToRgbUint32Array(region.HighlightColor ?? '#6b9e1f');
      result[region.Id] = facsimileCropper.get_region(p, r, color, 0) as string;
    }
  }

  return result;
}
