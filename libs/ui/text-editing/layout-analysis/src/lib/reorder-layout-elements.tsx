import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { IImageElement, ITextElement } from '@frontend/domain';
import { orderBy } from 'lodash';
import { LayoutElementSummary } from './layout-element-summary';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sortable, useAppDispatch } from '@frontend/shared-ui';

export interface IReorderLayoutElementsProps {
  dataUrls: Record<string, string>;
  textElements: Omit<ITextElement, 'Lines'>[];
  imageElements: IImageElement[];
}

export const ReorderLayoutElements = ({
  dataUrls,
  textElements,
  imageElements,
}: IReorderLayoutElementsProps) => {
  const elements = orderBy(
    [
      ...textElements.map((el) => ({
        ...el,
        url: dataUrls[el._id],
        icon: 'text',
      })),
      ...imageElements.map((el) => ({
        ...el,
        url: dataUrls[el._id],
        icon: 'image',
      })),
    ],
    'Order'
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
        {elements.map((el) => (
          <Sortable
            move={(movedElement, target) =>
              console.log({ movedElement, target })
            }
            index={el.Order}
            id={el._id}
            style={{ width: '60%' }}
            key={el._id}
          >
            <LayoutElementSummary
              maxHeight="10vh"
              width="100%"
              buttons={false}
              {...el}
            />
          </Sortable>
        ))}
      </Stack>
    </DndProvider>
  );
};
