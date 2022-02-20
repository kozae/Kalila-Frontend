import { selectImageUrl, useAppSelector } from '@frontend/shared-ui';
import { AnimatePresence } from 'framer-motion';
import React, { useContext } from 'react';
import { TextEditingWorkspaceContext } from '../../text-editing-workspace-context';
import { useImageContainerSize } from '../../hooks/use-image-container-size';
import { FacsimileSpaceLoading } from './facsimile-space-loading';
import {
  FacsimileSpaceSelector,
  IFacsimileSpaceProps,
} from './facsimile-space-selector';

export const FacsimileSpace = () => {
  const { loading, activeWorkspace } = useContext(TextEditingWorkspaceContext);
  const imageUrl = useAppSelector(selectImageUrl);
  const containerSize = useImageContainerSize();
  const props: IFacsimileSpaceProps = {
    url: imageUrl,
    width: containerSize.width,
    height: containerSize.height,
    activeWorkspace,
  };
  const noData = loading || imageUrl === '' || containerSize.height <= 0;
  return (
    <AnimatePresence exitBeforeEnter>
      {noData ? (
        <FacsimileSpaceLoading />
      ) : (
        <FacsimileSpaceSelector {...props} />
      )}
    </AnimatePresence>
  );
};
