import { useAppDispatch } from '@frontend/shared-ui';
import { ILine, IPoint, ITextElement } from '@frontend/domain';
import { highlightColors, PolygonHelper } from '@frontend/ui/facsimile';

export function useSingleLineGenerationHandler() {
  const dispatch = useAppDispatch();

  return (
    element: Omit<ITextElement, 'Lines'>,
    id: string,
    order: number = 0
  ) => {
    const points = [
      { X: element.FacsimileRegion[0], Y: element.FacsimileRegion[1] },
      { X: element.FacsimileRegion[2], Y: element.FacsimileRegion[3] },
      { X: element.FacsimileRegion[4], Y: element.FacsimileRegion[5] },
      { X: element.FacsimileRegion[6], Y: element.FacsimileRegion[7] },
    ] as IPoint[];
    const { Width, Height } = PolygonHelper.getWidthAndHeight(points);
    const line: Omit<ILine, 'Tokens'> & { ElementId: string } = {
      Id: id,
      LineOrder: order,
      ElementId: element.Id,
      HighlightColor: highlightColors[0],
      FacsimileRegion: PolygonHelper.getSubRegion(
        points,
        element.FacsimileRegion[8],
        {
          top: 0,
          left: 0,
          width: Width - 10,
          height: Math.max(50, (10 * Height) / 100),
        }
      ),
    };

    return line;
  };
}
