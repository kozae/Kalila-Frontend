import './index.module.scss';
import {
  selectUser,
  useAppSelector,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import { useMemo } from 'react';
import { BookUnitPanel } from '@frontend/ui/book-analysis/book-unit-administration';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export function UnitAdministration() {
  const messages = useMemo(
    () => ['Book Analysis:', 'Unit Administration'] as [string, string],
    []
  );
  const loggedUser = useAppSelector(selectUser);
  useNavbarMessage(messages);
  return (
    <DndProvider backend={HTML5Backend}>
      <BookUnitPanel
        verticalAnimate={true}
        accessMode={
          loggedUser?.roles?.includes('admin')
            ? 'admin'
            : loggedUser?.roles?.includes('book_unit_tagger')
            ? 'tag'
            : undefined
        }
      />
    </DndProvider>
  );
}
export default withTransition(UnitAdministration, {});
