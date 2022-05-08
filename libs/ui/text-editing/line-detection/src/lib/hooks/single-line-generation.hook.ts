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
    const { Width, Height } = PolygonHelper.getWidthAndHeight(
      element.FacsimileRegion?.Points as IPoint[]
    );
    const line: Omit<ILine, 'Tokens'> & { ElementId: string } = {
      Id: id,
      LineOrder: order,
      ElementId: element.Id,
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

    return line;
  };
}
