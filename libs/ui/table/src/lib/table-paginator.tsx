import * as React from 'react';
import { useCallback } from 'react';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { IPagination } from '@frontend/util';

export interface IPaginatorProps {
  pagination: IPagination;
  onPaginationChange: (pagination: IPagination) => void;
  loading?: boolean;
}

export const TablePaginator: React.FC<IPaginatorProps> = ({
  loading,
  pagination,
  onPaginationChange,
}) => {
  const handleChangePage = useCallback(
    (e: any, newPage: number) => {
      onPaginationChange({ ...pagination, currentPage: newPage + 1 });
    },
    [pagination, onPaginationChange]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onPaginationChange({
        ...pagination,
        itemsPerPage: parseInt(event.target.value, 10),
      });
    },
    [pagination, onPaginationChange]
  );
  return (
    <>
      {loading ? (
        <Box
          sx={{
            width: '405px',
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LinearProgress sx={{ width: '85%' }} />
        </Box>
      ) : (
        <TablePagination
          component="div"
          count={pagination.totalItems}
          page={pagination.currentPage - 1}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.itemsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};
