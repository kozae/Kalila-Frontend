import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import { ILine, IPoint, ITextElement } from '@frontend/domain';
import {
  createRegionsDataUrls,
  highlightColors,
  PolygonHelper,
} from '@frontend/ui/facsimile';
import { addDataUrl, useAppDispatch } from '@frontend/ui/store';

export function useSingleLineGenerationHandler() {
  const dispatch = useAppDispatch();
  const { fabricImg } = useContext(TextEditingWorkspaceContext);
  const onUrlCreated = (id: string, data: string) =>
    dispatch(addDataUrl({ id, data }));

  return (
    element: Omit<ITextElement, 'Lines'>,
    id: string,
    order: number = 0
  ) => {
    const { Width, Height } = PolygonHelper.getWidthAndHeight(
      element.FacsimileRegion?.Points as IPoint[]
    );
    const line: Omit<ILine, 'Tokens'> & { ElementId: string } = {
      _id: id,
      LineOrder: order,
      ElementId: element._id,
      HighlightColor: highlightColors[0],
      FacsimileRegion: {
        Points: PolygonHelper.getSubRegion(
          element.FacsimileRegion?.Points as IPoint[],
          element.FacsimileRegion?.Rotation as number,
          {
            top: 0,
            left: 0,
            width: Width - 10,
            height: Math.max(50, (10 * Height) / 100),
          }
        ),
        Rotation: element.FacsimileRegion?.Rotation as number,
      },
    };
    if (fabricImg !== null) {
      createRegionsDataUrls(
        [
          {
            Id: line._id,
            HighlightColor: line.HighlightColor,
            ...line.FacsimileRegion,
          },
        ],
        fabricImg,
        onUrlCreated
      );
    }
    return line;
  };
}
