import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

export interface IDocumentsDetailedViewControlBarProps {
  activeFilter: Record<string, any>;
  selection: Set<string>;
  docCount: number;
  onClearFilter: () => void;
  showConfigureColumnsModal: () => void;
}

const editButtonTextSelector = (selected: number, filtered: number) => ({
  disable: 'Edit',
  one: 'Edit Selected',
  many: `Edit Selected (${selected})`,
  filter: `Edit Filtered (${filtered})`,
});

export const DocumentsDetailedViewControlBar = ({
  activeFilter,
  selection,
  docCount,
  onClearFilter,
  showConfigureColumnsModal,
}: IDocumentsDetailedViewControlBarProps) => {
  const { push, pathname } = useRouter();
  const filterActivated = useMemo(
    () => Object.keys(activeFilter).length !== 0,
    [Object.keys(activeFilter).length]
  );
  const editMode = useMemo(() => {
    if (selection.size === 1) {
      return 'one';
    }
    if (selection.size > 1) {
      return 'many';
    }

    if (filterActivated && docCount > 0 && docCount <= 20) {
      return 'filter';
    }
    return 'disable';
  }, [filterActivated, selection, docCount]);

  const editButtonText = useMemo(
    () => editButtonTextSelector(selection.size, docCount)[editMode],
    [selection.size, docCount, editMode]
  );

  const onEdit = useCallback(async () => {
    await push({
      pathname: `${pathname}/edit`,
      query:
        editMode === 'filter' ? activeFilter : { Id: new Array(...selection) },
    });
  }, [editMode, activeFilter, selection]);

  return (
    <Stack direction="row" spacing={0.5}>
      <Button
        color="secondary"
        startIcon={<FilterAltOffIcon />}
        disableElevation
        variant="text"
        disabled={!filterActivated}
        onClick={onClearFilter}
      >
        Clear filters
      </Button>
      <Button
        color="secondary"
        startIcon={<ViewColumnIcon />}
        disableElevation
        variant="text"
        onClick={() => showConfigureColumnsModal()}
      >
        Configure columns...
      </Button>
      <Button
        color="secondary"
        startIcon={<GetAppIcon />}
        disableElevation
        variant="text"
        disabled
      >
        Export...
      </Button>
      <Button
        color="secondary"
        startIcon={<EditIcon />}
        disableElevation
        variant="text"
        disabled={editMode === 'disable'}
        onClick={onEdit}
      >
        {editButtonText}
      </Button>
    </Stack>
  );
};
