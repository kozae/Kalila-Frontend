import Stack from '@mui/material/Stack';
import { useTextEditingWorkspaceStore } from '@frontend/shared-ui';
import { FacsimileSpace, ToolSpace } from './components';
import {
  TextEditingWorkspaceContext,
  useTextEditingWorkspaceContext,
} from './text-editing-workspace-context';

export function TextEditingWorkspace({ pageData, imageSize }: any) {
  useTextEditingWorkspaceStore(pageData, imageSize);
  const contextValue = useTextEditingWorkspaceContext();
  return (
    <TextEditingWorkspaceContext.Provider value={contextValue}>
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
    </TextEditingWorkspaceContext.Provider>
  );
}

export default TextEditingWorkspace;
