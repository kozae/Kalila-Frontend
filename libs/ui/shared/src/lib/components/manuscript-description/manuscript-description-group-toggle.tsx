import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export interface IManuscriptDescriptionGroupToggleProps {
  changeSchemaFilter: (filter: any) => void;
  schemaFilter: Record<string, any>;
  view?: 'menu' | 'toolbar';
}

const groups = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'Codicology',
    value: 'Codicology',
  },
  {
    name: 'Version',
    value: 'Version',
  },
  {
    name: 'Redaction',
    value: 'Redaction',
  },
  {
    name: 'Relation',
    value: 'Relation',
  },
];

export const ManuscriptDescriptionGroupToggle = ({
  changeSchemaFilter,
  schemaFilter,
  view,
}: IManuscriptDescriptionGroupToggleProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeSchemaFilterAndClose = (filter: any) => {
    changeSchemaFilter(filter);
    handleClose();
  };

  return view === 'toolbar' ? (
    <Stack direction="row" spacing={0.5}>
      {groups.map((g) => (
        <Button
          onClick={() =>
            changeSchemaFilter(g.value ? { FieldGroup: g.value } : {})
          }
          color="secondary"
          disableElevation
          variant={
            schemaFilter['FieldGroup'] === g.value ? 'contained' : 'text'
          }
          key={g.name}
        >
          {g.name}
        </Button>
      ))}
    </Stack>
  ) : (
    <>
      <Button
        id="group-toggle-menu-btn"
        aria-controls={open ? 'group-toggle-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="secondary"
        disableElevation
        variant="contained"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
      >
        Group: {schemaFilter['FieldGroup'] ?? 'All'}
      </Button>
      <Menu
        id="group-toggle-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'group-toggle-menu-btn',
        }}
      >
        {groups.map((g) => (
          <MenuItem
            sx={{ typography: 'button' }}
            onClick={() =>
              changeSchemaFilterAndClose(g.value ? { FieldGroup: g.value } : {})
            }
            key={g.name}
          >
            {g.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
