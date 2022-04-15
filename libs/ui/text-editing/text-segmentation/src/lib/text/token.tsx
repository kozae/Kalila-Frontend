import { IToken } from "@frontend/domain";
import Typography from "@mui/material/Typography";
import { useDrop } from "react-dnd";
import { Draggables, IItemData } from "../drag-layer";
import { insertUnit, useAppDispatch, closeUnit, updateUnit } from "@frontend/shared-ui";
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
          dispatch(updateUnit({
            id: item.data.Id,
            changes: {
              StartsInPageNumber: currentPageNumber,
              StartsInLineNumber: lineOrder,
              FirstTokenOrderInLine: d.OrderInLine
            }
          }));
          // TODO make into a thunk: 1) find the unit before. 2) if it ends at the token in the previous location, move the end as well.
          break;
        case Draggables.movableEndTag:
          dispatch(updateUnit({
            id: item.data.Id,
            changes: {
              EndsInPageNumber: currentPageNumber,
              EndsInLineNumber: lineOrder,
              LastTokenOrderInLine: d.OrderInLine
            }
          }));
          // Todo add double click to delete tags
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
