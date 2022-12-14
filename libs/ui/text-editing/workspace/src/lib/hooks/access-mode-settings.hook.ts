import { useEffect } from 'react';
import {
  selectUser,
  selectPageEditor,
  useAppSelector,
  useAppDispatch,
  setTextEditingAccessMode,
} from '@frontend/shared-ui';

export function useAccessModeSettings() {
  const dispatch = useAppDispatch();
  const editor = useAppSelector(selectPageEditor);
  const loggedUser = useAppSelector(selectUser);

  useEffect(() => {
    if (loggedUser?.roles?.includes('admin')) {
      dispatch(setTextEditingAccessMode(['admin']));
    } else if (editor === loggedUser.username) {
      if (loggedUser?.roles?.includes('book_unit_tagger')) {
        dispatch(setTextEditingAccessMode(['edit', 'book_unit_tagger']));
      } else {
        dispatch(setTextEditingAccessMode(['edit']));
      }
    } else {
      if (loggedUser?.roles?.includes('book_unit_tagger')) {
        dispatch(setTextEditingAccessMode(['view', 'book_unit_tagger']));
      } else {
        dispatch(setTextEditingAccessMode(['view']));
      }
    }
  }, [editor, loggedUser.username]);
}
