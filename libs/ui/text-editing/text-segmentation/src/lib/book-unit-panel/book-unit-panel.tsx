import React, { useEffect, useMemo, useState } from 'react';
import { BookUnit, IBookUnit, IChapter, IUnitSummary } from '@frontend/domain';
import { SelectChapter } from './select-chapter';
import { BookUnitContainer } from './book-unit-container';
import { CommandBar } from './command-bar';
import {
  loadBookUnits,
  repopulateUnitSummariesBeforeChanges,
  selectAccessToken,
  selectAllUnitSummaries,
  selectCurrentPageManuscriptId,
  selectNearestOpenUnit,
  updateManyUnits,
  updateNearestOpenUnit,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { getBookUnits } from './get-book-units';
import CircularProgress from '@mui/material/CircularProgress';
import { AnimatePresence, motion } from 'framer-motion';
import { CreateBookUnitDialog, EditBookUnitDialog } from './dialogs';
import { BookUnitPanelContext } from './book-unit-panel.context';
import { BookUnitPanelDragLayer } from './book-unit-panel-drag-layer';
import { Update } from '@reduxjs/toolkit';

export const BookUnitPanel = () => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [createUnitDialogOpen, setCreateUnitDialogOpen] =
    useState<boolean>(false);
  const [editBookUnitDialogIsOpen, setEditBookUnitDialogIsOpen] =
    useState<boolean>(false);
  const [selectedBookUnit, setSelectedBookUnit] = useState<BookUnit | null>(
    null
  );

  const accessToken = useAppSelector(selectAccessToken);
  const manuscriptId = useAppSelector(selectCurrentPageManuscriptId);
  const unitsOnPage = useAppSelector(selectAllUnitSummaries);
  const openUnit = useAppSelector(selectNearestOpenUnit);
  const {
    data,
    isValidating,
    mutate: refetchUnits,
  } = getBookUnits(accessToken, chapter, manuscriptId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data) {
      dispatch(loadBookUnits(data.content));
      const unitSummaryUpdates: Update<IUnitSummary>[] = [];
      unitsOnPage.forEach((unit) => {
        const bu = data.content.find(
          (u: IBookUnit) => u.Id === unit.BookUnitId
        );
        if (bu !== undefined) {
          unitSummaryUpdates.push({
            id: unit.Id,
            changes: {
              Order: bu.Order,
              BookUnit: bu.Title,
              FrameTags: bu.FrameTags,
            },
          });
        }
      });
      dispatch(updateManyUnits(unitSummaryUpdates));
      if (openUnit) {
        const bu = data.content.find(
          (u: IBookUnit) => u.Id === openUnit.BookUnitId
        );
        dispatch(
          updateNearestOpenUnit({
            ...openUnit,
            Order: bu.Order,
            BookUnit: bu.Title,
            FrameTags: bu.FrameTags,
          })
        );
      }
      dispatch(repopulateUnitSummariesBeforeChanges({}));
    }
  }, [data]);

  const contextValue = useMemo(
    () => ({
      chapter,
      setChapter,
      filter,
      setFilter,
      createUnitDialogOpen,
      setCreateUnitDialogOpen,
      editBookUnitDialogIsOpen,
      setEditBookUnitDialogIsOpen,
      selectedBookUnit,
      setSelectedBookUnit,
      refetchUnits,
    }),
    [
      chapter,
      filter,
      createUnitDialogOpen,
      editBookUnitDialogIsOpen,
      selectedBookUnit,
      refetchUnits,
    ]
  );

  return (
    <BookUnitPanelContext.Provider value={contextValue}>
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
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -200 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        >
          {chapter !== null && <CommandBar />}
          {chapter === null && <SelectChapter />}
          {chapter !== null && <BookUnitContainer key={chapter.abbr} />}
          {isValidating && (
            <CircularProgress
              color="secondary"
              sx={{ p: '2rem', mt: '2rem' }}
              size={200}
            />
          )}
          <EditBookUnitDialog />
          <CreateBookUnitDialog />
          <BookUnitPanelDragLayer />
        </motion.div>
      </AnimatePresence>
    </BookUnitPanelContext.Provider>
  );
};
