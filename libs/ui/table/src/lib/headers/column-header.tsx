import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useCallback, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { IHeaderProps, SortControl } from '@frontend/ui/table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { FilterControl } from '../column-controls/filter-control';
import Badge from '@mui/material/Badge';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  faSortAmountDown,
  faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const filterIcon = <FilterAltIcon fontSize="inherit" />;
const ascSortIcon = (
  <FontAwesomeIcon size="xs" icon={faSortAmountUpAlt.iconName as IconProp} />
);
const descSortIcon = (
  <FontAwesomeIcon size="sm" icon={faSortAmountDown.iconName as IconProp} />
);
const useBadge = (activeFilter: any, activeSort: any, f: any) =>
  useMemo(() => {
    const isSortActive = activeSort.OrderBy === f.FieldNamePascalCase;
    const isAscSortActive = isSortActive && activeSort.SortDirection !== 'desc';
    const isDescSortActive =
      isSortActive && activeSort.SortDirection === 'desc';
    const isFilterActive = Object.keys(activeFilter).some((key) =>
      key.startsWith(f.FieldNamePascalCase as string)
    );

    if (isFilterActive) {
      if (!isSortActive) {
        return filterIcon;
      }
      if (isAscSortActive) {
        return (
          <Stack direction="row">
            {filterIcon}
            {ascSortIcon}
          </Stack>
        );
      }

      if (isDescSortActive) {
        return (
          <Stack direction="row">
            {filterIcon}
            {descSortIcon}
          </Stack>
        );
      }
    }

    if (!isFilterActive) {
      if (isAscSortActive) {
        return ascSortIcon;
      }

      if (isDescSortActive) {
        return descSortIcon;
      }
    }

    return null;
  }, [activeFilter, activeSort]);

export const ColumnHeader = ({
  bgcolor,
  color,
  f,
  sx = {},
  activeSort,
  onSort,
  onFilter,
  activeFilter,
  exactMatch,
  categoricalAttributes,
}: IHeaderProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleFilter = (filter: any) => {
    onFilter(filter);
  };
  const handleSort = (sort: any) => {
    onSort(sort);
  };

  const handleClickAway = useCallback(() => {
    if (open) {
      setAnchorEl(null);
    }
  }, [open]);

  const id = open ? `${f.FieldDisplay}-popper` : undefined;
  const badgeContent = useBadge(activeFilter, activeSort, f);
  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            p: '.2rem',
            height: '40px',
            bgcolor: bgcolor,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...sx,
          }}
        >
          <Box
            sx={{
              width: '200px',
              height: '40px',
              position: 'absolute',
              top: 0,
              // visibility: buttonIsVisible ? 'visible' : 'hidden',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton onClick={handleClick} color="secondary">
              <Badge
                invisible={badgeContent === null}
                color="warning"
                badgeContent={badgeContent}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <SettingsIcon />
              </Badge>
            </IconButton>
          </Box>

          <Typography align="center" variant="h4">
            {f.FieldDisplay}
          </Typography>

          <Popper
            placement="bottom-end"
            disablePortal
            id={id}
            open={open}
            anchorEl={anchorEl}
          >
            <Paper
              elevation={3}
              sx={{
                width: '200px',
                bgcolor: 'white',
                p: '.5rem',
                borderRadius: '5px',
              }}
            >
              <Stack justifyContent="center" alignItems="center">
                <FilterControl
                  f={f}
                  activeFilter={activeFilter}
                  onFilter={handleFilter}
                  exactMatch={exactMatch}
                  categoricalAttributes={categoricalAttributes}
                />
                <SortControl
                  f={f}
                  activeSort={activeSort}
                  onSort={handleSort}
                />
              </Stack>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>
    </>
  );
};

export const PrimaryGreenHeader = (props: IHeaderProps) => (
  <ColumnHeader {...props} bgcolor="primary.main" color="white" />
);

export const WhiteHeader = (props: IHeaderProps) => (
  <ColumnHeader {...props} bgcolor="white" color="black" />
);

export const GrayHeader = (props: IHeaderProps) => (
  <ColumnHeader {...props} bgcolor="#666666" color="white" />
);
