import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRef, useState } from 'react';
import {
  selectWorkspaceHasChanges,
  useAppSelector,
  useBoolean,
  useMediumScreenMediaQuery,
  useSmallScreenMediaQuery,
  useXSmallScreenMediaQuery,
} from '@frontend/shared-ui';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { GoToModal } from './go-to-modal';
import { PagePreviewPopper } from './page-preview-popper';

export interface IManuscriptPagesPaginatorProps {
  manuscriptId: string;
  allPages: { Id: string; Number: number }[];
  current: number;
}

const back = () => <ChevronLeftIcon sx={{ fontSize: '2.1rem' }} />;
const forward = () => <ChevronRightIcon sx={{ fontSize: '2.1rem' }} />;

export const ManuscriptPagesPaginator = ({
  manuscriptId,
  allPages,
  current,
}: IManuscriptPagesPaginatorProps) => {
  const [page, setPage] = useState(current);
  const paginationRef = useRef<HTMLDivElement>();
  const isXSmallScreen = useXSmallScreenMediaQuery();
  const isSmallScreen = useSmallScreenMediaQuery();
  const isMDScreen = useMediumScreenMediaQuery();
  const [
    gotoModalIsOpen,
    { setTrue: openGotoModal, setFalse: dismissGotoModal },
  ] = useBoolean(false);
  const [pagePreviewAnchorEl, setPagePreviewAnchorEl] =
    useState<null | HTMLElement>(null);
  const [pagePreviewId, setPagePreviewId] = useState<string | undefined>(
    undefined
  );
  const count = isSmallScreen ? 0 : isMDScreen ? 3 : 5;

  const showPagePreview = (pageNumber: number) => {
    setPagePreviewId(allPages[pageNumber - 1].Id);
    paginationRef &&
      paginationRef.current &&
      setPagePreviewAnchorEl(paginationRef.current);
  };

  const hidePagePreview = () => {
    setPagePreviewId(undefined);
    setPagePreviewAnchorEl(null);
  };
  const router = useRouter();

  const handleChange = async (e: any, v: number) => {
    dismissGotoModal();
    await router.push(`/text-editing/${manuscriptId}/${allPages[v - 1].Id}`);
    setPage(v);
  };
  const handleSummaryClicked = async () => {
    await router.push(`/text-editing/${manuscriptId}`);
  };
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  // todo add a goto modal
  return (
    <>
      <Stack direction="row">
        <Button
          variant="contained"
          onClick={handleSummaryClicked}
          disableElevation
        >
          List
        </Button>
        <Button onClick={openGotoModal} variant="contained" disableElevation>
          Go to...
        </Button>
        {!isXSmallScreen && (
          <Pagination
            onChange={handleChange}
            ref={paginationRef}
            boundaryCount={count}
            siblingCount={Math.floor(count / 2)}
            page={page}
            count={allPages.length}
            color="secondary"
            shape="rounded"
            disabled={workspaceHasChanges}
            renderItem={(item) => (
              <PaginationItem
                components={{
                  previous: back,
                  next: forward,
                }}
                {...item}
                onMouseEnter={() => item.page && showPagePreview(item.page)}
                onMouseLeave={() => hidePagePreview()}
                size="large"
                sx={{ typography: 'button', color: 'white' }}
              />
            )}
          />
        )}
      </Stack>
      <GoToModal
        open={gotoModalIsOpen}
        min={1}
        max={allPages.length}
        handleClose={dismissGotoModal}
        submit={(v) => handleChange({}, v)}
      />
      <PagePreviewPopper
        key={pagePreviewId ?? 'page-preview'}
        anchor={pagePreviewAnchorEl}
        pageId={pagePreviewId}
        manuscriptId={manuscriptId}
      />
    </>
  );
};
