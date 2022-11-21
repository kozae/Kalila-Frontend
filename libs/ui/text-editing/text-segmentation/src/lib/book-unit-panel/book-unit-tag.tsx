import { BookUnit, IBookUnit } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { InsertableUnit } from '../draggables';
import React, { useCallback, useContext } from 'react';
import { bookUnitOrderDisplay, stringHasValue } from '@frontend/util';
import { BookUnitPanelContext } from './book-unit-panel.context';
import {
  ApiClient,
  removeLacuna,
  selectTextEditingAccessMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
export const BookUnitTag = ({
  d,
}: {
  d: IBookUnit & { ManuscriptInfo: string | null };
}) => {
  const { setSelectedBookUnit, setEditBookUnitDialogIsOpen, refetchUnits } =
    useContext(BookUnitPanelContext);
  const handleEditBookUnit = (d: IBookUnit) => {
    setSelectedBookUnit(
      new BookUnit(
        d.Id,
        d.Order,
        d.Divider,
        d.Title,
        d.Variant,
        d.FrameTags ?? [],
        d.Topics ?? [],
        d.Motifs ?? []
      )
    );
    setEditBookUnitDialogIsOpen(true);
  };
  const dispatch = useAppDispatch();
  const onDeleteLacunae = (id: string, msUnitId: string) => {
    dispatch(removeLacuna({ id, lacuna: msUnitId }));
  };

  const onDeleteDivider = useCallback(
    async (id: string) => {
      await deleteBookUnit(id as string);
      if (refetchUnits) {
        await refetchUnits();
      }
    },
    [refetchUnits]
  );

  if (stringHasValue(d.ManuscriptInfo)) {
    if (d.ManuscriptInfo?.startsWith('lacuna')) {
      return (
        <AssignedUnitLacuna
          onEdit={() => handleEditBookUnit(d)}
          onDelete={() =>
            onDeleteLacunae(
              d.Id,
              d.ManuscriptInfo?.replace('lacuna_', '') ?? ''
            )
          }
          d={d}
          key={d.Id}
        />
      );
    }
    return (
      <AssignedUnit onEdit={() => handleEditBookUnit(d)} d={d} key={d.Id} />
    );
  } else if (d.Divider) {
    return (
      <BoundaryUnit
        onDelete={() => onDeleteDivider(d.Id)}
        onEdit={() => handleEditBookUnit(d)}
        d={d}
        key={d.Id}
      />
    );
  } else {
    return (
      <InsertableUnit onEdit={() => handleEditBookUnit(d)} d={d} key={d.Id} />
    );
  }
};

interface IBookUnitTagProps {
  d: IBookUnit & { ManuscriptInfo: string | null };
  onEdit: (d: IBookUnit) => void;
}

const AssignedUnitLacuna = ({
  d,
  onEdit,
  onDelete,
}: IBookUnitTagProps & { onDelete: () => void }) => {
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  return (
    <Stack
      width="48%"
      bgcolor="#F1F1F1"
      sx={{
        borderRadius: '5px',
        m: '3px',
        p: '3px',
        border: 'solid 1px',
      }}
      direction="column"
      alignItems="center"
    >
      <Stack
        position="relative"
        width="100%"
        justifyContent="center"
        direction="row"
        alignItems="baseline"
      >
        <Stack
          sx={{ position: 'absolute', top: 0, left: 0 }}
          justifyContent="flex-start"
          alignItems="center"
          direction="row"
        >
          <Typography
            fontWeight="bold"
            fontSize="0.8rem"
            variant="body1"
            pr="3px"
            pl="3px"
            borderRadius="5px"
          >
            lacuna
          </Typography>
          <IconButton size="small" onClick={onDelete} color="warning">
            <RemoveCircleIcon sx={{ fontSize: '0.8rem' }} />
          </IconButton>
        </Stack>

        <Typography fontSize="1rem" variant="body1">
          {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)} &nbsp; [
          {d.Order.map((i) => `${i}.`)}]
        </Typography>
        {(accessMode.includes('book_unit_admin') ||
          accessMode.includes('admin')) && (
          <IconButton
            sx={{ position: 'absolute', top: 0, right: 0 }}
            size="small"
            onClick={() => onEdit(d)}
          >
            <EditTwoToneIcon fontSize="small" color="primary" />
          </IconButton>
        )}
      </Stack>
      <Typography fontSize="1rem" variant="body1">
        {d.Title}
      </Typography>
    </Stack>
  );
};

const AssignedUnit = ({ d, onEdit }: IBookUnitTagProps) => {
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  return (
    <Stack
      width="48%"
      bgcolor="#F1F1F1"
      sx={{
        borderRadius: '5px',
        m: '3px',
        p: '3px',
        border: 'solid 1px',
      }}
      direction="column"
      alignItems="center"
    >
      <Stack
        position="relative"
        width="100%"
        justifyContent="center"
        direction="row"
        alignItems="baseline"
      >
        <Typography
          sx={{ position: 'absolute', top: 0, left: 0 }}
          fontWeight="bold"
          fontSize="0.8rem"
          variant="body1"
          pr="3px"
          pl="3px"
          borderRadius="5px"
        >
          {'p.' + d.ManuscriptInfo}
        </Typography>
        <Typography fontSize="1rem" variant="body1">
          {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)} &nbsp; [
          {d.Order.map((i) => `${i}.`)}]
        </Typography>
        {(accessMode.includes('book_unit_admin') ||
          accessMode.includes('admin')) && (
          <IconButton
            sx={{ position: 'absolute', top: 0, right: 0 }}
            size="small"
            onClick={() => onEdit(d)}
          >
            <EditTwoToneIcon fontSize="small" color="primary" />
          </IconButton>
        )}
      </Stack>
      <Typography fontSize="1rem" variant="body1">
        {d.Title}
      </Typography>
    </Stack>
  );
};

const BoundaryUnit = ({
  d,
  onEdit,
  onDelete,
}: IBookUnitTagProps & { onDelete: () => void }) => {
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  return (
    <Stack
      width="96%"
      bgcolor="#F1F1F1"
      sx={{
        borderRadius: '5px',
        m: '3px',
        p: '3px',
        border: 'solid 1px',
      }}
      direction="column"
      alignItems="center"
    >
      <Stack
        position="relative"
        width="100%"
        justifyContent="center"
        direction="row"
        alignItems="baseline"
      >
        {(accessMode.includes('book_unit_admin') ||
          accessMode.includes('admin')) && (
          <Stack
            sx={{ position: 'absolute', top: 0, left: 0 }}
            justifyContent="flex-start"
            alignItems="center"
            direction="row"
          >
            <Typography
              fontWeight="bold"
              fontSize="0.8rem"
              variant="body1"
              pr="3px"
              pl="3px"
              borderRadius="5px"
            >
              divider
            </Typography>
            <IconButton size="small" onClick={onDelete} color="warning">
              <RemoveCircleIcon sx={{ fontSize: '0.8rem' }} />
            </IconButton>
          </Stack>
        )}
        <Typography fontSize="1rem" variant="body1">
          {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)} &nbsp; [
          {d.Order.map((i) => `${i}.`)}]
        </Typography>
        {(accessMode.includes('book_unit_admin') ||
          accessMode.includes('admin')) && (
          <IconButton
            sx={{ position: 'absolute', top: 0, right: 0 }}
            size="small"
            onClick={() => onEdit(d)}
          >
            <EditTwoToneIcon fontSize="small" color="primary" />
          </IconButton>
        )}
      </Stack>
      <Typography fontSize="1rem" variant="body1">
        {d.Title}
      </Typography>
    </Stack>
  );
};

async function deleteBookUnit(id: string) {
  await ApiClient().delete(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, {
    params: {
      Id: id,
    },
    headers: {},
  });
}
