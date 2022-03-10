import {
  addDataUrl,
  loadGeneratedLines,
  selectFirstTextElement,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import * as uuid from 'uuid';
import { ILine, IPoint } from '@frontend/domain';
import {
  createRegionsDataUrls,
  highlightColors,
  PolygonHelper,
} from '@frontend/ui/facsimile';

export function useFirstLineGenerationHandler() {
  const firstTextElement = useAppSelector(selectFirstTextElement);
  const dispatch = useAppDispatch();
  const { fabricImg } = useContext(TextEditingWorkspaceContext);
  const onUrlCreated = (id: string, data: string) =>
    dispatch(addDataUrl({ id, data }));

  return () => {
    const { Width, Height } = PolygonHelper.getWidthAndHeight(
      firstTextElement.FacsimileRegion?.Points as IPoint[]
    );
    const line: Omit<ILine, 'Tokens'> & { ElementId: string } = {
      _id: uuid.v4(),
      LineOrder: 1,
      ElementId: firstTextElement._id,
      HighlightColor: highlightColors[0],
      FacsimileRegion: {
        Points: PolygonHelper.getSubRegion(
          firstTextElement.FacsimileRegion?.Points as IPoint[],
          firstTextElement.FacsimileRegion?.Rotation as number,
          {
            top: 0,
            left: 0,
            width: Width - 10,
            height: Math.max(50, (10 * Height) / 100),
          }
        ),
        Rotation: firstTextElement.FacsimileRegion?.Rotation as number,
      },
    };
    dispatch(loadGeneratedLines([line]));
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
  };
}
