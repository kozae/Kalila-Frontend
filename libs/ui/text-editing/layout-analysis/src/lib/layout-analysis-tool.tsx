import { LayoutAnalysisCommandBar } from './layout-analysis-command-bar';
import Stack from '@mui/material/Stack';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutElementsList } from './layout-elements-list';
import { EditLayoutElement } from './edit-layout-element';
import { ReorderLayoutElements } from './reorder-layout-elements';
import {
  selectAllImageElements,
  selectAllTextElements,
  selectManyRegionDataUrlById,
  selectSelectedElement,
  selectTextEditingToolMode,
  useAppSelector,
} from '@frontend/ui/store';

export function LayoutAnalysisTool() {
  const imageElements = useAppSelector(selectAllImageElements);
  const textElements = useAppSelector(selectAllTextElements);
  const selectedElement = useAppSelector(selectSelectedElement);
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const dataUrls = useAppSelector((state) =>
    selectManyRegionDataUrlById(
      state,
      [...imageElements, ...textElements].map((i) => i._id)
    )
  );

  return (
    <Stack
      sx={{
        mt: '5px',
        width: '100%',
        height: '100%',
      }}
    >
      <AnimatePresence exitBeforeEnter>
        {selectedElement.id === null ? (
          <motion.div
            key="layout-analysis-tool-preview-mode"
            style={{
              width: '100%',
              height: 'fit-content',
              maxHeight: '100%',
              minHeight: '100%',
              backgroundColor: '#DDDDDD',
              overflow: 'scroll',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <LayoutAnalysisCommandBar
              numberOfImageElements={imageElements.length}
              numberOfTextElements={textElements.length}
              toolMode={toolMode}
            />
            {toolMode === 'default' && (
              <LayoutElementsList
                dataUrls={dataUrls}
                imageElements={imageElements}
                textElements={textElements}
              />
            )}
            {toolMode === 'reorder' && (
              <ReorderLayoutElements
                dataUrls={dataUrls}
                imageElements={imageElements}
                textElements={textElements}
              />
            )}
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
            <EditLayoutElement selectedElement={selectedElement} />
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
}

export default LayoutAnalysisTool;
