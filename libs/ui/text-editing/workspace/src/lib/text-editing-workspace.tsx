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
import { useImageAsFabricObject } from './hooks';
import { TextEditingWorkspaceContext } from './text-editing-workspace-context';

export function TextEditingWorkspace({ pageData, imageSize }: any) {
  const fabricImg = useImageAsFabricObject(pageData.FacsimileImageUrl);
  useTextEditingWorkspaceStore(pageData, imageSize, fabricImg);
  useAccessModeSettings();
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  useNavigationAwayGuard(workspaceHasChanges);
  return (
    <TextEditingWorkspaceContext.Provider value={{ fabricImg }}>
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
    </TextEditingWorkspaceContext.Provider>
  );
}

export default TextEditingWorkspace;
