import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

export interface IDocumentsDetailedViewControlBarProps {
  activeFilter: Record<string, any>;
  selection: string[];
  docCount: number;
  onClearFilter: () => void;
  showConfigureColumnsModal: () => void;
  view?: 'menu' | 'toolbar';
}

const editButtonTextSelector = (selected: number, filtered: number) => ({
  disable: 'Edit',
  one: 'Edit Selected',
  many: `Edit Selected (${selected})`,
  filter: `Edit Filtered (${filtered})`,
});

export const DocumentsDetailedViewActions = ({
  activeFilter,
  selection,
  docCount,
  onClearFilter,
  showConfigureColumnsModal,
  view,
}: IDocumentsDetailedViewControlBarProps) => {
  const { push, pathname } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const filterActivated = useMemo(
    () => Object.keys(activeFilter).length !== 0,
    [Object.keys(activeFilter).length]
  );
  const editMode = useMemo(() => {
    if (selection.length === 1) {
      return 'one';
    }
    if (selection.length > 1) {
      return 'many';
    }

    if (filterActivated && docCount > 0 && docCount <= 20) {
      return 'filter';
    }
    return 'disable';
  }, [filterActivated, selection, docCount]);

  const editButtonText = useMemo(
    () => editButtonTextSelector(selection.length, docCount)[editMode],
    [selection.length, docCount, editMode]
  );

  const onEdit = useCallback(async () => {
    await push({
      pathname: `${pathname}/edit`,
      query:
        editMode === 'filter' ? activeFilter : { Id: new Array(...selection) },
    });
  }, [editMode, activeFilter, selection]);

  const actions = [
    {
      key: 'ClearFilters',
      text: 'Clear filters',
      icon: <FilterAltOffIcon />,
      disabled: !filterActivated,
      onClick: onClearFilter,
    },
    {
      key: 'ConfigureColumns',
      text: 'Configure columns...',
      icon: <ViewColumnIcon />,
      disabled: false,
      onClick: () => showConfigureColumnsModal(),
    },
    {
      key: 'Export',
      text: 'Export...',
      icon: <GetAppIcon />,
      disabled: true,
      onClick: () => {},
    },
    {
      key: 'Edit',
      text: editButtonText,
      icon: <EditIcon />,
      disabled: editMode === 'disable',
      onClick: onEdit,
    },
  ];

  return view === 'toolbar' ? (
    <Stack direction="row" spacing={0.5}>
      {actions.map((action) => (
        <Button
          key={action.key}
          color="secondary"
          startIcon={action.icon}
          disableElevation
          variant="text"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.text}
        </Button>
      ))}
    </Stack>
  ) : (
    <>
      <Button
        id="DocumentsDetailedViewActionsMenuBtn"
        aria-controls={open ? 'DocumentsDetailedViewActionsMenu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        variant="contained"
        color="secondary"
        disableElevation
      >
        Actions
      </Button>
      <Menu
        id="DocumentsDetailedViewActionsMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'DocumentsDetailedViewActionsMenuBtn',
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            disabled={action.disabled}
            onClick={action.onClick}
          >
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText>{action.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
