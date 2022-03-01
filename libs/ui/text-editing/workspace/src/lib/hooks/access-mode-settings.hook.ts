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
    if (editor === loggedUser.username) {
      dispatch(setTextEditingAccessMode('edit'));
    } else {
      dispatch(setTextEditingAccessMode('view'));
    }
  }, [editor, loggedUser.username]);
}
