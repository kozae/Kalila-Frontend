import { ILine, IPoint, ITextElement } from '@frontend/domain';
import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import {
  loadGeneratedLines,
  setTextEditingToolMode,
  useAppDispatch,
} from '@frontend/shared-ui';
import { createAndDispatchLineDataUrl } from './helpers';
import { highlightColors, PolygonHelper } from '@frontend/ui/facsimile';
import * as uuid from 'uuid';

function generateLines(
  element: Omit<ITextElement, 'Lines'>,
  numberOfLines: number,
  existingLines: number
) {
  const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
  const { Width, Height } = PolygonHelper.getWidthAndHeight(
    element.FacsimileRegion?.Points as IPoint[]
  );
  const lineHeight = Math.round(Height / numberOfLines);
  for (let i = 0; i < numberOfLines; i++) {
    lines.push({
      _id: uuid.v4(),
      LineOrder: existingLines + i + 1,
      ElementId: element._id,
      HighlightColor: highlightColors[(existingLines + i + 1) % 13],
      FacsimileRegion: {
        Points: PolygonHelper.getSubRegion(
          element.FacsimileRegion?.Points as IPoint[],
          element.FacsimileRegion?.Rotation as number,
          {
            top: i * lineHeight,
            left: 0,
            width: Width,
            height: lineHeight,
          }
        ),
        Rotation: element.FacsimileRegion?.Rotation as number,
      },
    });
  }
  return lines;
}

export function useLinesGenerator(
  textElements: Array<Omit<ITextElement, 'Lines'>>
) {
  const { fabricImg } = useContext(TextEditingWorkspaceContext);
  const dispatch = useAppDispatch();
  return (linesPerElement: { [elementId: string]: number | undefined }) => {
    const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
    // seperate into main lines and gloss lines
    textElements.forEach((el) => {
      lines.push(
        ...generateLines(el, linesPerElement[el._id] as number, lines.length)
      );
    });
    dispatch(loadGeneratedLines(lines));
    createAndDispatchLineDataUrl(lines, fabricImg, dispatch);
    dispatch(setTextEditingToolMode('default'));
  };
}
