import { IChapter } from '@frontend/domain';
import {
  selectBookUnitsWithFilter,
  selectCurrentPageManuscriptId,
  selectUser,
  useAppSelector,
} from '@frontend/shared-ui';
import {
  BookUnitPanelProvider,
  IBookUnitPanelProps,
} from '@frontend/ui/book-analysis/book-unit-administration';
import { useState } from 'react';
import {
  useBookUnits,
  useBookUnitsStore,
  useCRUDHandlers,
  useRefetchOnSegmentationChange,
} from './helpers';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export const BookUNitAdministrationWrapper = () => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [unitTitleFilter, setUnitTitleFilter] = useState<string>('');
  const manuscriptId = useAppSelector(selectCurrentPageManuscriptId);
  const { data, mutate: refetchUnits } = useBookUnits(chapter, manuscriptId);

  useBookUnitsStore(data);
  useRefetchOnSegmentationChange(refetchUnits);
  const handlers = useCRUDHandlers(refetchUnits);
  const units = useAppSelector((state) =>
    selectBookUnitsWithFilter(state, unitTitleFilter)
  );
  const loggedUser = useAppSelector(selectUser);
  const props: IBookUnitPanelProps = {
    verticalAnimate: true,
    accessMode: loggedUser?.roles?.includes('admin')
      ? 'admin'
      : loggedUser?.roles?.includes('book_unit_tagger')
      ? 'tag'
      : undefined,
    units,
    chapter,
    unitTitleFilter,
    setChapter,
    setUnitTitleFilter,
    ...handlers,
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <BookUnitPanelProvider {...props} />
    </DndProvider>
  );
};
