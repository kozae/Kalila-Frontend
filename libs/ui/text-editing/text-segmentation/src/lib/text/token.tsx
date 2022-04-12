import { IToken } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { useDrop } from 'react-dnd';
import { Draggables, IItemData } from '../drag-layer';
import { insertUnit, useAppDispatch } from '@frontend/shared-ui';
import { v4 } from 'uuid';

export interface ITokenProps {
  d: IToken & { LineId: string; type: 'token' | 'blocking' };
  currentPageNumber: number;
  lineOrder: number;
}

export const Token = ({ d, currentPageNumber, lineOrder }: ITokenProps) => {
  const dispatch = useAppDispatch();
  const [{ isOver, canDrop, itemType }, drop] = useDrop(() => ({
    accept: [Draggables.insertableUnit, Draggables.insertableEndTag],
    canDrop: () => d.type !== 'blocking',
    drop: (item: IItemData) => {
      switch (item.type) {
        case Draggables.insertableUnit:
          dispatch(
            insertUnit({
              Id: v4(),
              BookUnitId: item.data.Id,
              BookUnit: item.data.Title,
              BookUnitOrder: item.data.OrderInChapter,
              Chapter: item.data.Chapter,
              Type: 'n',
              StartsInPageNumber: currentPageNumber,
              StartsInLineNumber: lineOrder,
              FirstTokenOrderInLine: d.OrderInLine,
            })
          );
          console.log('inserting', item);
          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType(),
    }),
  }));

  return (
    <Typography
      ref={drop}
      sx={{
        pl: '.4rem',
        borderRight:
          isOver && canDrop && itemType === Draggables.insertableUnit
            ? 'gray 20px solid'
            : 'none',
        borderLeft:
          isOver && canDrop && itemType === Draggables.insertableEndTag
            ? 'gray 20px solid'
            : 'none',
      }}
      variant={'body2'}
    >
      {d.RawToken}
    </Typography>
  );
};
