export type ResizeHandlePosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export type RotateHandlePosition =
  | 'topRotate'
  | 'bottomRotate'
  | 'leftRotate'
  | 'rightRotate';

export type HandlePosition = ResizeHandlePosition | RotateHandlePosition;
