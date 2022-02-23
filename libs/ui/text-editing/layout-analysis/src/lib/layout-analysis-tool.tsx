import { LayoutAnalysisCommandBar } from './layout-analysis-command-bar';
import Stack from '@mui/material/Stack';
import { LayoutElementsList } from './Layout-elements-list';
import { LayoutAnalysisToolContext } from './layout-analysis-tool.context';
import { IImageElement, ITextElement } from '@frontend/domain';

export interface ILayoutAnalysisToolProps {
  onElementHovered: (element: ITextElement | IImageElement | null) => void;
}

export function LayoutAnalysisTool({
  onElementHovered,
}: ILayoutAnalysisToolProps) {
  return (
    <LayoutAnalysisToolContext.Provider value={{ onElementHovered }}>
      <Stack
        sx={{ mt: '5px', width: '100%', height: '100%', bgcolor: '#DDDDDD' }}
      >
        <LayoutAnalysisCommandBar />
        <LayoutElementsList />
      </Stack>
    </LayoutAnalysisToolContext.Provider>
  );
}

export default LayoutAnalysisTool;
