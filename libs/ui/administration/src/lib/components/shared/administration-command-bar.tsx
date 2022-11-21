import React, { useMemo } from 'react';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { KalilaDocument } from '@frontend/domain';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface IAdministrationCommandBarProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>; // just for type inference
  selection: string[];
  editByFilter?: boolean;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  filter: Record<any, string>;
}

export const AdministrationCommandBar = <T extends KalilaDocument>({
  selection,
  onCreate,
  onEdit,
  onDelete,
  editByFilter,
  filter,
}: IAdministrationCommandBarProps<T>) => {
  editByFilter = editByFilter === undefined ? true : editByFilter;
  const enableEditSelection = useMemo(
      () => selection.length > 0,
      [selection.length]
    ),
    enableEditByFilter = useMemo(
      () => editByFilter && Object.keys(filter).length > 0,
      [Object.keys(filter).length]
    ),
    enableDelete = useMemo(() => selection.length === 1, [selection.length]);

  return (
    <Stack direction="row" spacing={1.5}>
      <Button
        startIcon={<AddIcon />}
        variant="text"
        sx={{ padding: '.2rem' }}
        color={'secondary'}
        onClick={onCreate}
      >
        Create
      </Button>
      <Button
        startIcon={<EditIcon />}
        variant="text"
        sx={{ padding: '.5rem' }}
        color={'secondary'}
        disabled={!enableEditByFilter && !enableEditSelection}
        onClick={onEdit}
      >
        {enableEditSelection
          ? 'Edit selected '
          : enableEditByFilter
          ? 'Edit filtered'
          : 'Edit'}
      </Button>
      <Button
        startIcon={<DeleteIcon />}
        variant="text"
        sx={{ padding: '.2rem' }}
        color={'warning'}
        disabled={!enableDelete}
        onClick={onDelete}
      >
        Delete
      </Button>
    </Stack>
  );
};
