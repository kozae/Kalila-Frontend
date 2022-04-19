import { IUnitSummary } from "@frontend/domain";
import Typography from "@mui/material/Typography";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { Draggables } from "../drag-layer";
import { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { removeUnit, useAppDispatch } from "@frontend/shared-ui";

export interface IMovableUnitStartProps {
  d: IUnitSummary;
}

export const MovableUnitStart = ({ d }: IMovableUnitStartProps) => {
  const dispatch = useAppDispatch();
  const [{ isDragging }, drag, dragPreview] = useDrag<any, any, any>(
    () => ({
      type: Draggables.movableUnit,
      item: { data: d, type: Draggables.movableUnit },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [d]
  );
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <Typography
      ref={drag}
      onDoubleClick={() => {
        dispatch(removeUnit(d.Id));
      }}
      sx={{
        bgcolor: "secondary.main",
        color: "white",
        p: ".4rem",
        ml: ".4rem",
        borderRadius: "5px",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1
      }}
      fontWeight={"600"}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >{`(${d.BookUnitOrder}) ${d.Chapter}`}</Typography>
  );
};


export const MovableUnitStartDragPreview = ({ d }: IMovableUnitStartProps) => {
  return (
    <Typography
      sx={{
        bgcolor: "secondary.main",
        color: "white",
        p: ".4rem",
        ml: ".4rem",
        borderRadius: "5px",
        opacity: ".7"
      }}
      fontWeight={"600"}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >{`(${d.BookUnitOrder}) ${d.BookUnit}`}</Typography>
  );
};
