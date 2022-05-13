import Stack from '@mui/material/Stack';
import {
  FramerFadeInOut,
  FullPageLoadingIndicator,
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
  SavingIndicator,
} from './components';
import { useAccessModeSettings } from './hooks';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import dynamic from 'next/dynamic';
import {
  FacsimileCropper,
  loadFacsimileCropper,
  useFacsimileCropper,
} from '@frontend/ui/facsimile-cropper';
import { useEffect } from 'react';

export const TextEditingWorkspaceWasm = dynamic({
  loader: async () => {
    const cropper = await loadFacsimileCropper();
    return ({ pageData, imageSize }: any) => {
      const facsimileCropper = useFacsimileCropper(
        pageData.FacsimileImageUrl,
        cropper.FacsimileCropper.new
      );
      useEffect(() => {
        return () => {
          if (facsimileCropper !== null) {
            facsimileCropper.free();
          }
        };
      }, []);
      return facsimileCropper !== null ? (
        <TextEditingWorkspace {...{ facsimileCropper, pageData, imageSize }} />
      ) : (
        <FramerFadeInOut visibleWhen={true}>
          <FullPageLoadingIndicator />
        </FramerFadeInOut>
      );
    };
  },
  loading: () => <FullPageLoadingIndicator />,
  ssr: false,
});

interface ITextEditingWorkspaceProps {
  pageData: any;
  imageSize: any;
  facsimileCropper: FacsimileCropper;
}

function TextEditingWorkspace({
  pageData,
  imageSize,
  facsimileCropper,
}: ITextEditingWorkspaceProps) {
  useTextEditingWorkspaceStore(pageData, imageSize);
  useAccessModeSettings();
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  useNavigationAwayGuard(workspaceHasChanges);

  return (
    <TextEditingWorkspaceContext.Provider value={{ facsimileCropper }}>
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
        <SavingIndicator />
      </Stack>
    </TextEditingWorkspaceContext.Provider>
  );
}
