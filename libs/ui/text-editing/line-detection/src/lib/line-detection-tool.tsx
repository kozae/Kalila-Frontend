import { DefineLinesChoices } from './define-lines-choices';
import { LineList } from './line-list';
import { EditLine } from './edit-line';
import { ReorderLines } from './line-reordering';
import {
  selectNumberOfLines,
  selectSelectedElement,
  selectTextEditingToolMode,
  useAppSelector,
} from '@frontend/ui/store';

// todo animate transitions
export const LineDetectionTool = () => {
  const numberOfLines = useAppSelector(selectNumberOfLines);
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const selectedLine = useAppSelector(selectSelectedElement);

  if (selectedLine.id !== null) return <EditLine selectedLine={selectedLine} />;
  if (numberOfLines === 0) return <DefineLinesChoices />;
  return toolMode === 'default' ? (
    <LineList />
  ) : toolMode === 'reorder' ? (
    <ReorderLines />
  ) : (
    <></>
  );
};
