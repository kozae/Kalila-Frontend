import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { DataEntrySchema } from '@frontend/util';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export interface IConfigureColumnsModalProps {
  isOpen: boolean;
  excludedColumns: Set<string>;
  fields: DataEntrySchema[];
  onDismiss: () => void;
  changeExcludedColumns: (value: Set<string>) => void;
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

export const ConfigureColumnsModal = ({
  isOpen,
  onDismiss,
  fields,
  excludedColumns,
  changeExcludedColumns,
}: IConfigureColumnsModalProps) => {
  const visibleColumns = useMemo(
    () => fields.filter((f) => !excludedColumns.has(f.FieldNamePascalCase)),
    [fields, excludedColumns]
  );
  return (
    <Modal open={isOpen} onClose={onDismiss} aria-labelledby="configureColumns">
      <Stack alignItems={'center'} sx={style} spacing={2}>
        <DialogHeading color="secondary" onDismiss={onDismiss}>
          <Typography color="white" variant="h5">
            Configure columns
          </Typography>
        </DialogHeading>
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ width: '800px', height: '600px' }} />
        </DndProvider>
      </Stack>
    </Modal>
  );
};
