import {
  selectAllLines,
  selectNumberOfLines,
  selectTextEditingToolMode,
  useAppSelector,
} from '@frontend/shared-ui';
import { DefineLinesChoices } from './define-lines-choices';
import { LineList } from './line-list';

export const LineDetectionTool = () => {
  const numberOfLines = useAppSelector(selectNumberOfLines);
  const toolMode = useAppSelector(selectTextEditingToolMode);

  if (numberOfLines === 0) return <DefineLinesChoices />;
  return toolMode === 'default' ? <LineList /> : <></>;
};
