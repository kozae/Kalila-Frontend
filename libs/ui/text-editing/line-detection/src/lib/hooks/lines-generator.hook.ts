import { ILine, IPoint, ITextElement } from '@frontend/domain';
import {
  loadGeneratedLines,
  setTextEditingToolMode,
  useAppDispatch,
} from '@frontend/shared-ui';
import { highlightColors, PolygonHelper } from '@frontend/ui/facsimile';
import * as uuid from 'uuid';

function generateLines(
  element: Omit<ITextElement, 'Lines'>,
  numberOfLines: number,
  existingLines: number
) {
  const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
  const points = [
    { X: element.FacsimileRegion[0], Y: element.FacsimileRegion[1] },
    { X: element.FacsimileRegion[2], Y: element.FacsimileRegion[3] },
    { X: element.FacsimileRegion[4], Y: element.FacsimileRegion[5] },
    { X: element.FacsimileRegion[6], Y: element.FacsimileRegion[7] },
  ] as IPoint[];
  const { Width, Height } = PolygonHelper.getWidthAndHeight(points);
  const lineHeight = Math.round(Height / numberOfLines);
  for (let i = 0; i < numberOfLines; i++) {
    lines.push({
      Id: 'generated_' + uuid.v4(),
      LineOrder: existingLines + i,
      ElementId: element.Id,
      HighlightColor: highlightColors[(existingLines + i) % 13],
      FacsimileRegion: PolygonHelper.getSubRegion(
        points,
        element.FacsimileRegion[8],
        {
          top: i * lineHeight,
          left: 0,
          width: Width,
          height: lineHeight,
        }
      ),
    });
  }
  return lines;
}

export function useLinesGenerator(
  textElements: Array<Omit<ITextElement, 'Lines'>>
) {
  const dispatch = useAppDispatch();
  return (linesPerElement: { [elementId: string]: number | undefined }) => {
    const mainLines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
    const glossLines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];

    textElements.forEach((el) => {
      if (el.Position.startsWith('main')) {
        mainLines.push(
          ...generateLines(
            el,
            linesPerElement[el.Id] as number,
            mainLines.length
          )
        );
      } else {
        glossLines.push(
          ...generateLines(
            el,
            linesPerElement[el.Id] as number,
            glossLines.length
          )
        );
      }
    });
    dispatch(loadGeneratedLines([...mainLines, ...glossLines]));
    dispatch(setTextEditingToolMode('default'));
  };
}
