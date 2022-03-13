import { useEffect } from 'react';
import {
  selectPageEditor,
  selectUser,
  setTextEditingAccessMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/ui/store';

export function useAccessModeSettings() {
  const dispatch = useAppDispatch();
  const editor = useAppSelector(selectPageEditor);
  const loggedUser = useAppSelector(selectUser);

  useEffect(() => {
    if (editor === loggedUser.username) {
      dispatch(setTextEditingAccessMode('edit'));
    } else {
      dispatch(setTextEditingAccessMode('view'));
    }
  }, [editor, loggedUser.username]);
}
