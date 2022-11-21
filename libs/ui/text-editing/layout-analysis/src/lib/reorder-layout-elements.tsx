import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { IImageElement, ITextElement } from '@frontend/domain';
import { orderBy } from 'lodash';
import {
  ILayoutElementSummaryProps,
  LayoutElementSummary,
} from '@frontend/ui/text-editing/shared';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Sortable,
  updateImageElement,
  updateTextElement,
  useAppDispatch,
} from '@frontend/shared-ui';
import { useCallback, useEffect, useState } from 'react';
import update from 'immutability-helper';

export interface IReorderLayoutElementsProps {
  textElements: Omit<ITextElement, 'Lines'>[];
  imageElements: IImageElement[];
}

export const ReorderLayoutElements = ({
  textElements,
  imageElements,
}: IReorderLayoutElementsProps) => {
  const dispatch = useAppDispatch();
  const [elements, setElements] = useState<ILayoutElementSummaryProps[]>(
    orderBy(
      [
        ...textElements.map((el) => ({
          ...el,
          icon: 'text',
        })),
        ...imageElements.map((el) => ({
          ...el,
          icon: 'image',
        })),
      ],
      'Order'
    ) as ILayoutElementSummaryProps[]
  );

  const move = useCallback((dragIndex: number, hoverIndex: number) => {
    setElements((prevElements) =>
      update(prevElements, {
        $splice: [
          [dragIndex, 1],
          [
            hoverIndex,
            0,
            prevElements[dragIndex] as ILayoutElementSummaryProps,
          ],
        ],
      })
    );
  }, []);

  useEffect(() => {
    elements.forEach((el, index) => {
      if (el.Order !== index) {
        if (el.icon === 'image') {
          dispatch(
            updateImageElement({ id: el.Id, changes: { Order: index } })
          );
        } else {
          dispatch(updateTextElement({ id: el.Id, changes: { Order: index } }));
        }
      }
    });
  }, [elements]);

  const renderElement = useCallback(
    (el: ILayoutElementSummaryProps, index: number) => {
      return (
        <Sortable
          move={move}
          index={index}
          id={el.Id}
          style={{ width: '60%' }}
          key={el.Id}
        >
          <LayoutElementSummary
            {...el}
            Order={index}
            maxHeight="10vh"
            width="100%"
            buttons={false}
          />
        </Sortable>
      );
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Stack
        sx={{ flexGrow: 1, mt: '5px', width: '100%' }}
        flexWrap="wrap"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        {elements.length === 0 && (
          <Alert severity="info">No elements defined.</Alert>
        )}
        {elements.map((el, index) => renderElement(el, index))}
      </Stack>
    </DndProvider>
  );
};
