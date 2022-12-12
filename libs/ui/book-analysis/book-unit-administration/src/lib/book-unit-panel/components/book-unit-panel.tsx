import { SelectChapter } from './select-chapter';
import { BookUnitContainer } from './book-unit-container';
import { CommandBar } from './command-bar';
import { AnimatePresence, motion } from 'framer-motion';
import { CreateBookUnitDialog, EditBookUnitDialog } from './dialogs';
import { BookUnitPanelDragLayer } from './book-unit-panel-drag-layer';
import { EditFrameDialog } from './dialogs/edit-frame-dialog';
import { useUIOptions } from '../contexts/ui-options.context';
import { useData } from '../contexts/data.context';

export const BookUnitPanel = () => {
  const { verticalAnimate } = useUIOptions();
  const { chapter } = useData();
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={chapter ? chapter.abbr : 'select-chapter'}
        style={{
          width: '45%',
          height: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'scroll',
        }}
        initial={{
          opacity: 0,
          x: !verticalAnimate ? -200 : 0,
          y: verticalAnimate ? 200 : 0,
        }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{
          opacity: 0,
          x: !verticalAnimate ? -200 : 0,
          y: verticalAnimate ? 200 : 0,
        }}
        transition={{ duration: 1, ease: 'easeIn' }}
      >
        {chapter !== null && <CommandBar />}
        {chapter === null && <SelectChapter />}
        {chapter !== null && <BookUnitContainer key={chapter.abbr} />}

        <EditBookUnitDialog />
        <CreateBookUnitDialog />
        <BookUnitPanelDragLayer />
        <EditFrameDialog />
      </motion.div>
    </AnimatePresence>
  );
};
