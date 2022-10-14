import Stack from '@mui/material/Stack';
import { useBehaviorOptions, useData, useLayoutData } from './contexts';
import {
  Collation,
  CommandBar,
  FacsimilePreview,
  getMapContainerProps,
  ImageCollationModal,
  Map,
  SearchHints,
  TextHorizontalCollationModal,
  UnitTitlePreview,
} from './components';

export const EditionPage = () => {
  const { showNavbar } = useLayoutData();
  const { mapState } = useBehaviorOptions();
  const { updateTime } = useData();

  return (
    <>
      <CommandBar />
      <TextHorizontalCollationModal />
      <ImageCollationModal />
      <FacsimilePreview />
      <UnitTitlePreview />
      <SearchHints />
      <Stack
        direction={mapState === 'bottom' ? 'column-reverse' : 'row'}
        width="100%"
        justifyContent={
          mapState && mapState.startsWith('left') ? 'space-between' : 'center'
        }
        alignItems="center"
      >
        {mapState && (
          <Stack {...getMapContainerProps(mapState, showNavbar)}>
            <Map mapState={mapState} key={`${updateTime}`} />
          </Stack>
        )}
        <Collation key={`${updateTime}`} />
      </Stack>
    </>
  );
};
