import { IFacsimileRegion, ILine } from '@frontend/domain';
import { fabric } from 'fabric';
import { addDataUrl, KalilaAppDispatch } from '@frontend/shared-ui';
import { createRegionsDataUrls } from '@frontend/ui/facsimile';

export const createAndDispatchLineDataUrl = (
  lines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }>,
  fabricImg: fabric.Image | null,
  dispatch: KalilaAppDispatch
) => {
  const onUrlCreated = (id: string, data: string) =>
    dispatch(addDataUrl({ id, data }));
  if (fabricImg !== null) {
    const data = lines.map(
      (el) =>
        el && {
          Id: el.Id,
          HighlightColor: el.HighlightColor,
          ...el.FacsimileRegion,
        }
    ) as Array<IFacsimileRegion & { Id: string; HighlightColor?: string }>;
    createRegionsDataUrls(data, fabricImg, onUrlCreated);
  }
};
