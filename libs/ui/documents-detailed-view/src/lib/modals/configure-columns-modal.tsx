import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import {
  DialogHeading,
  Draggable,
  DropContainer,
  kalilaTheme,
} from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { DataEntrySchema, InputModes, stringHasValue } from '@frontend/util';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SxProps } from '@mui/system/styleFunctionSx';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export interface IConfigureColumnsModalProps {
  isOpen: boolean;
  excludedColumns: Set<string>;
  fields: DataEntrySchema[];
  onDismiss: () => void;
  includeColumns: (value: string[]) => void;
  excludeColumns: (value: string[]) => void;
  resetColumns: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  minWidth: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

const dropContainerStyle: SxProps = {
  width: '380px',
  maxHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  border: `solid 5px ${kalilaTheme.palette.primary.dark}`,
  flexGrow: 1,
  overflowY: 'scroll',
};

const draggableItemStyles = {
  m: '.2rem',
  borderColor: 'black',
  borderRadius: '5px',
  border: 'solid 2px',
  width: '95%',
  padding: '.5rem',
  fontSize: '1rem',
  fontWeight: '500',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const ContainerHeading = ({ text }: { text: string }) => (
  <Typography
    width="100%"
    bgcolor="primary.dark"
    color="white"
    typography="h3"
    padding="3px"
    textAlign="center"
    borderRadius="5px 5px 0 0"
  >
    {text}
  </Typography>
);

export const ConfigureColumnsModal = ({
  isOpen,
  onDismiss,
  fields,
  excludedColumns,
  includeColumns,
  excludeColumns,
  resetColumns,
}: IConfigureColumnsModalProps) => {
  const visibleColumns = useMemo(
    () =>
      fields.filter(
        (f) => !f.TopField && !excludedColumns.has(f.FieldNamePascalCase)
      ),
    [fields, excludedColumns]
  );
  const invisibleColumns = useMemo(
    () => fields.filter((f) => excludedColumns.has(f.FieldNamePascalCase)),
    [fields, excludedColumns]
  );
  const categories = [
    ...new Set(
      fields
        .filter((f) => stringHasValue(f.FieldCategory))
        .map((f) => f.FieldCategory)
    ),
  ];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleInclude = (data: any) =>
    includeColumns([data.FieldNamePascalCase]);
  const handleExclude = (data: any) =>
    excludeColumns([data.FieldNamePascalCase]);

  const handleExcludeCommentaryFields = () =>
    excludeColumns(
      fields
        .filter((f) => f.InputMode === InputModes.RichText)
        .map((f) => f.FieldNamePascalCase)
    );

  const handleExcludeCategory = (category: string) => {
    handleClose();
    excludeColumns(
      fields
        .filter((f) => f.FieldCategory === category)
        .map((f) => f.FieldNamePascalCase)
    );
  };

  return (
    <Modal open={isOpen} onClose={onDismiss} aria-labelledby="configureColumns">
      <Stack alignItems={'center'} sx={style} spacing={0.5}>
        <DialogHeading color="primary" onDismiss={onDismiss}>
          <Typography color="white" variant="h5">
            Configure Columns
          </Typography>
        </DialogHeading>
        <Stack direction="row" spacing={0.5}>
          <Button
            onClick={resetColumns}
            color="secondary"
            disableElevation
            variant="outlined"
          >
            Reset to defaults
          </Button>
          <Button
            onClick={handleExcludeCommentaryFields}
            color="secondary"
            disableElevation
            variant="outlined"
          >
            Exclude all commentary fields
          </Button>
          {categories.length !== 0 && (
            <>
              <Button
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="secondary"
                disableElevation
                variant="outlined"
                endIcon={<ArrowDropDownIcon />}
              >
                Exclude a category
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                  style: {
                    maxHeight: '250px',
                    width: '23ch',
                  },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem
                    key={cat}
                    sx={{ typography: 'button' }}
                    onClick={() => handleExcludeCategory(cat as string)}
                  >
                    {cat}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Stack>
        <DndProvider backend={HTML5Backend}>
          <Stack
            justifyContent="space-around"
            direction="row"
            sx={{ width: '800px', height: '600px' }}
          >
            <Stack alignItems="center" justifyContent="center" spacing=".5">
              <ContainerHeading text="Included Columns" />
              <DropContainer
                name="includedColumns"
                accept="field"
                sx={dropContainerStyle}
                onDrop={handleInclude}
              >
                {visibleColumns.map((f, i) => (
                  <Draggable
                    data={f}
                    key={f.FieldNamePascalCase}
                    itemType="field"
                    sx={draggableItemStyles}
                  >
                    <span>
                      {stringHasValue(f.FieldCategory)
                        ? `${f.FieldCategory}: ${f.FieldDisplay}`
                        : f.FieldDisplay}
                    </span>
                    <IconButton
                      onClick={() => handleExclude(f)}
                      color="warning"
                    >
                      <ArrowRightIcon fontSize="large" />
                    </IconButton>
                  </Draggable>
                ))}
              </DropContainer>
            </Stack>
            <Stack sx={{ height: '100%' }} alignItems="center" spacing=".5">
              <ContainerHeading text="Excluded Columns" />
              <DropContainer
                name="excludedColumns"
                accept="field"
                sx={dropContainerStyle}
                onDrop={handleExclude}
              >
                {invisibleColumns.map((f, i) => (
                  <Draggable
                    data={f}
                    key={f.FieldNamePascalCase}
                    itemType="field"
                    sx={draggableItemStyles}
                  >
                    <IconButton
                      onClick={() => handleInclude(f)}
                      color="secondary"
                    >
                      <ArrowLeftIcon fontSize="large" />
                    </IconButton>
                    <span>
                      {stringHasValue(f.FieldCategory)
                        ? `${f.FieldCategory}: ${f.FieldDisplay}`
                        : f.FieldDisplay}
                    </span>
                  </Draggable>
                ))}
              </DropContainer>
            </Stack>
          </Stack>
        </DndProvider>
      </Stack>
    </Modal>
  );
};
