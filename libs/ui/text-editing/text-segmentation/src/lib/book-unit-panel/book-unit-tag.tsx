import { BookUnit, IBookUnit } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { InsertableUnit } from '../draggables';
import React, { useContext } from 'react';
import { bookUnitOrderDisplay, stringHasValue } from '@frontend/util';
import { BookUnitPanelContext } from './book-unit-panel.context';

export const BookUnitTag = ({
  d,
}: {
  d: IBookUnit & { ManuscriptInfo: string | null };
}) => {
  const { setSelectedBookUnit, setEditBookUnitDialogIsOpen } =
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
  if (stringHasValue(d.ManuscriptInfo)) {
    return (
      <AssignedUnit onEdit={() => handleEditBookUnit(d)} d={d} key={d.Id} />
    );
  } else if (d.Divider) {
    return (
      <BoundaryUnit onEdit={() => handleEditBookUnit(d)} d={d} key={d.Id} />
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

const AssignedUnit = ({ d, onEdit }: IBookUnitTagProps) => {
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
          p.{d.ManuscriptInfo}
        </Typography>
        <Typography fontSize="1rem" variant="body1">
          {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)} &nbsp;
        </Typography>
        <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          size="small"
          onClick={() => onEdit(d)}
        >
          <EditTwoToneIcon fontSize="small" color="primary" />
        </IconButton>
      </Stack>
      <Typography fontSize="1rem" variant="body1">
        {d.Title}
      </Typography>
    </Stack>
  );
};

const BoundaryUnit = ({ d, onEdit }: IBookUnitTagProps) => {
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
        <Typography fontSize="1rem" variant="body1">
          {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)} &nbsp;
        </Typography>
        <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          size="small"
          onClick={() => onEdit(d)}
        >
          <EditTwoToneIcon fontSize="small" color="primary" />
        </IconButton>
      </Stack>
      <Typography fontSize="1rem" variant="body1">
        {d.Title}
      </Typography>
    </Stack>
  );
};
