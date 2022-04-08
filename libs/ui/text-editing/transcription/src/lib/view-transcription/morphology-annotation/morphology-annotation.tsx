import Popper from '@mui/material/Popper';
import { useCallback, useContext, useEffect } from 'react';
import {
  IViewTranscriptionProps,
  ViewTranscriptionContext,
} from '../view-transcription';
import Mousetrap from 'mousetrap';
import { flatten } from 'lodash';
import { IMorphology, ITextElement } from '@frontend/domain';
import {
  selectTokenCountsOfLinesAsMapOfOrder,
  upsertTokenMorphology,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { MorphologyPopperContent } from './morphology-popper-content';
import {
  getNextTokenDown,
  getNextTokenLeft,
  getNextTokenRight,
  getNextTokenUp,
  ITokenCounts,
} from './util';

export const MorphologyAnnotation = ({
  mainBodyElements,
  otherElements,
  linesToElementMap,
}: IViewTranscriptionProps) => {
  const {
    morphologyPopperAnchor,
    setMorphologyPopperAnchor,
    setSelectedToken,
    selectedToken,
  } = useContext(ViewTranscriptionContext);
  const morphologyPopperOpen = Boolean(morphologyPopperAnchor);

  const createLinesSummary = (elements: Omit<ITextElement, 'Lines'>[]) =>
    flatten(
      elements.map(({ Id }) =>
        linesToElementMap[Id].map(
          ({ Id, LineOrder }) => [Id, LineOrder] as [string, number]
        )
      )
    );

  useEffect(() => {
    if (selectedToken.line === undefined || selectedToken.token === undefined) {
      setMorphologyPopperAnchor(null);
    }
  }, [selectedToken]);

  const tokenCounts: ITokenCounts = {
    main: useAppSelector((state) =>
      selectTokenCountsOfLinesAsMapOfOrder(
        state,
        createLinesSummary(mainBodyElements)
      )
    ),
    other: useAppSelector((state) =>
      selectTokenCountsOfLinesAsMapOfOrder(
        state,
        createLinesSummary(otherElements)
      )
    ),
  };
  const moveUp = () =>
    setSelectedToken &&
    setSelectedToken((current) => getNextTokenUp(current, tokenCounts));
  const moveDown = () =>
    setSelectedToken &&
    setSelectedToken((current) => getNextTokenDown(current, tokenCounts));
  const moveLeft = () =>
    setSelectedToken &&
    setSelectedToken((current) => getNextTokenLeft(current, tokenCounts));
  const moveRight = () =>
    setSelectedToken &&
    setSelectedToken((current) => getNextTokenRight(current, tokenCounts));
  useEffect(() => {
    Mousetrap.bind('up', (e) => {
      e.preventDefault();
      moveUp();
    });
    Mousetrap.bind('down', (e) => {
      e.preventDefault();
      moveDown();
    });
    Mousetrap.bind('left', (e) => {
      e.preventDefault();
      moveLeft();
    });
    Mousetrap.bind('right', (e) => {
      e.preventDefault();
      moveRight();
    });

    return () => {
      Mousetrap.reset();
    };
  }, []);

  const dispatch = useAppDispatch();
  const handleSelection = useCallback(
    (d: IMorphology) => {
      if (
        selectedToken &&
        selectedToken.line !== undefined &&
        selectedToken.token !== undefined
      ) {
        const LineId =
          tokenCounts[selectedToken.elementType][selectedToken.line].id;
        const TokenOrder = selectedToken.token;
        dispatch(upsertTokenMorphology({ ...d, LineId, TokenOrder }));
      }

      moveLeft();
    },
    [selectedToken]
  );

  return (
    <Popper
      open={morphologyPopperOpen}
      anchorEl={morphologyPopperAnchor}
      placement="top"
      style={{ zIndex: 20 }}
    >
      <MorphologyPopperContent
        key={`${selectedToken.elementType}_${selectedToken.line}_${selectedToken.token}`}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onSkip={moveLeft}
        onSelected={handleSelection}
      />
    </Popper>
  );
};
