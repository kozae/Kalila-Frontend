import Stack from '@mui/material/Stack';
import {
  selectWorkspaceHasChanges,
  useAppSelector,
  useNavigationAwayGuard,
  useTextEditingWorkspaceStore,
} from '@frontend/shared-ui';
import {
  CommandBar,
  FacsimileSpace,
  MessageBar,
  ToolSpace,
} from './components';
import { useAccessModeSettings } from './hooks/access-mode-settings.hook';

export function TextEditingWorkspace({ pageData, imageSize }: any) {
  useTextEditingWorkspaceStore(pageData, imageSize);
  useAccessModeSettings();
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  useNavigationAwayGuard(workspaceHasChanges);
  return (
    <Stack
      mt="5px"
      width="100%"
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={1}
    >
      <FacsimileSpace />
      <ToolSpace />
      <CommandBar hasChanges={workspaceHasChanges} />
      <MessageBar />
    </Stack>
  );
}

export default TextEditingWorkspace;
