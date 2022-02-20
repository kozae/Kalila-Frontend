import Stack from '@mui/material/Stack';
import {
  selectPageDataLoadingStatus,
  useAppSelector,
  useTextEditingWorkspaceStore,
} from '@frontend/shared-ui';
import { FacsimileSpace, ToolSpace } from './components';

export function TextEditingWorkspace({ pageData, imageSize }: any) {
  useTextEditingWorkspaceStore(pageData, imageSize);
  const loadingStatus = useAppSelector(selectPageDataLoadingStatus);
  return (
    <Stack mt="5px" width="100%" direction="row" spacing={1}>
      <FacsimileSpace loading={loadingStatus} />
      <ToolSpace />
    </Stack>
  );
}

export default TextEditingWorkspace;
