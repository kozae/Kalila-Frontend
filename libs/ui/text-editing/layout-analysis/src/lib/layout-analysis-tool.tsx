import { LayoutAnalysisCommandBar } from './layout-analysis-command-bar';
import Stack from '@mui/material/Stack';
import { LayoutAnalysisToolContext } from './layout-analysis-tool.context';
import { IImageElement, ITextElement } from '@frontend/domain';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutElementsList } from './layout-elements-list';
import { EditLayoutElement } from './edit-layout-element';

export interface ILayoutAnalysisToolProps {
  onElementActivated: (element: ITextElement | IImageElement | null) => void;
  selectedElementId: string | null;
  regionUnderEditUrl: string | null;
  onElementSelected: (id: string | null) => void;
}

export function LayoutAnalysisTool({
  onElementActivated,
  selectedElementId,
  onElementSelected,
  regionUnderEditUrl,
}: ILayoutAnalysisToolProps) {
  return (
    <LayoutAnalysisToolContext.Provider
      value={{
        onElementActivated,
        selectedElementId,
        onElementSelected,
        regionUnderEditUrl,
      }}
    >
      <Stack
        sx={{ mt: '5px', width: '100%', height: '100%', bgcolor: '#DDDDDD' }}
      >
        <AnimatePresence exitBeforeEnter>
          {selectedElementId === null ? (
            <motion.div
              key="layout-analysis-tool-preview-mode"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <LayoutAnalysisCommandBar />
              <LayoutElementsList />
            </motion.div>
          ) : (
            <motion.div
              key="layout-analysis-tool-edit-mode"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <EditLayoutElement selectedElementId={selectedElementId} />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </LayoutAnalysisToolContext.Provider>
  );
}

export default LayoutAnalysisTool;
