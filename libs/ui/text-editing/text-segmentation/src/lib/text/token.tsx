import { IToken } from "@frontend/domain";
import Typography from "@mui/material/Typography";
import { useDrop } from "react-dnd";
import { Draggables, IItemData } from "../drag-layer";
import { insertUnit, useAppDispatch, closeUnit, updateUnit, moveUnit } from "@frontend/shared-ui";
import { v4 } from "uuid";

export interface ITokenProps {
  d: IToken & {
    LineId: string;
    type: "token" | "block-start" | "block-end" | "block-all";
  };
  currentPageNumber: number;
  lineOrder: number;
}

export const Token = ({ d, currentPageNumber, lineOrder }: ITokenProps) => {
  const dispatch = useAppDispatch();
  const [{ isOver, canDrop, itemType }, drop] = useDrop(() => ({
    accept: [Draggables.insertableUnit, Draggables.insertableEndTag, Draggables.movableUnit, Draggables.movableEndTag],
    canDrop: (item, monitor) => {
      if ([Draggables.insertableUnit, Draggables.movableUnit].includes(item.type)) {
        return d.type !== "block-start";
      }
      if ([Draggables.insertableEndTag, Draggables.movableEndTag].includes(item.type)) {
        return d.type !== "block-end";
      }

      return d.type !== "block-all";
    },
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
              Type: "n",
              StartsInPageNumber: currentPageNumber,
              StartsInLineNumber: lineOrder,
              FirstTokenOrderInLine: d.OrderInLine
            })
          );
          break;
        case Draggables.insertableEndTag:
          dispatch(closeUnit({ data: { page: currentPageNumber, line: lineOrder, token: d.OrderInLine } }));
          break;
        case Draggables.movableUnit:
          dispatch(moveUnit({
            unit: item.data, newLocation: {
              StartsInPageNumber: currentPageNumber,
              StartsInLineNumber: lineOrder,
              FirstTokenOrderInLine: d.OrderInLine
            }
          }));
          break;
        case Draggables.movableEndTag:
          if (lineOrder > item.data.StartsInLineNumber
            || (lineOrder === item.data.StartsInLineNumber && d.OrderInLine > item.data.FirstTokenOrderInLine)) {
            dispatch(updateUnit({
              id: item.data.Id,
              changes: {
                EndsInPageNumber: currentPageNumber,
                EndsInLineNumber: lineOrder,
                LastTokenOrderInLine: d.OrderInLine
              }
            }));
          }

          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType()
    })
  }));

  return (
    <Typography
      ref={drop}
      sx={{
        pl: ".4rem",
        borderRight:
          isOver && canDrop && [Draggables.insertableUnit, Draggables.movableUnit].includes(itemType as Draggables)
            ? "gray 20px solid"
            : "none",
        borderLeft:
          isOver && canDrop && [Draggables.insertableEndTag, Draggables.movableEndTag].includes(itemType as Draggables)
            ? "gray 20px solid"
            : "none"
      }}
      variant={"body2"}
    >
      {d.RawToken}
    </Typography>
  );
};
