import { IFacsimileRegion, ILine } from '@frontend/domain';
import { fabric } from 'fabric';
import { addManyDataUrls, KalilaAppDispatch } from '@frontend/shared-ui';
import { createRegionsDataUrls } from '@frontend/ui/facsimile';

export const createAndDispatchLineDataUrl = (
  lines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }>,
  fabricImg: fabric.Image | null,
  dispatch: KalilaAppDispatch
) => {
  if (fabricImg !== null) {
    const data = lines.map(
      (el) =>
        el && {
          Id: el.Id,
          HighlightColor: el.HighlightColor,
          ...el.FacsimileRegion,
        }
    ) as Array<IFacsimileRegion & { Id: string; HighlightColor?: string }>;
    createRegionsDataUrls(data, fabricImg).then((values) => {
      dispatch(addManyDataUrls(values));
    });
  }
};
