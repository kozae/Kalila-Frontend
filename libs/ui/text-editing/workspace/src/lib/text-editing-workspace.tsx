import Stack from '@mui/material/Stack';
import { useTextEditingWorkspaceStore } from '@frontend/shared-ui';
import { FacsimileSpace, ToolSpace } from './components';
import { useAccessModeSettings } from './hooks/access-mode-settings.hook';

export function TextEditingWorkspace({ pageData, imageSize }: any) {
  useTextEditingWorkspaceStore(pageData, imageSize);
  useAccessModeSettings();
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
    </Stack>
  );
}

export default TextEditingWorkspace;
