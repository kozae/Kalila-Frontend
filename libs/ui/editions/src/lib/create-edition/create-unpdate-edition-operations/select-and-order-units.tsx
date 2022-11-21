import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useBookUnits } from '../hooks';
import { Sortable } from '@frontend/shared-ui';
import { CHAPTERS, IChapter } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import update from 'immutability-helper';

export interface ISelectAndOrderUnitsProps {
  selectedBookUnits: string[];
  selectedBookUnitsTitles: Record<string, string>;
  setSelectedBookUnits: Dispatch<SetStateAction<string[]>>;
  setSelectedBookUnitsTitles: Dispatch<SetStateAction<Record<string, string>>>;
}

const SelectableBookUnit = ({
  Title,
  OrderInChapter,
  Id,
  isSelected,
  onAdd,
  onRemove,
}: any) => {
  return (
    <Stack
      justifyContent="space-between"
      sx={{
        width: '90%',
        bgcolor: isSelected ? 'primary.dark' : 'inherit',
        mt: '3px',
        borderRadius: '5px',
      }}
      direction="row"
    >
      <Typography
        sx={{ pl: '.5rem' }}
        color={isSelected ? 'white' : 'inherit'}
        variant="button"
        fontSize="0.8rem"
      >
        ({OrderInChapter}).{Title}
      </Typography>
      {!isSelected && (
        <IconButton
          onClick={() => onAdd(Id, Title)}
          color="secondary"
          aria-label="select"
        >
          <ArrowCircleRightTwoToneIcon />
        </IconButton>
      )}
      {isSelected && (
        <IconButton
          onClick={() => onRemove(Id)}
          color="warning"
          aria-label="select"
        >
          <ArrowCircleLeftIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export const SelectAndOrderUnits = ({
  selectedBookUnits,
  setSelectedBookUnits,
  selectedBookUnitsTitles,
  setSelectedBookUnitsTitles,
}: ISelectAndOrderUnitsProps) => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const { data: bookUnits } = useBookUnits(chapter ? chapter.abbr : null);

  const handleAddAll = useCallback(() => {
    if (bookUnits && bookUnits.content) {
      setSelectedBookUnits((prevState) => {
        const newState = [...prevState];
        bookUnits.content.forEach(({ Id }: any) => {
          if (!newState.includes(Id)) {
            newState.push(Id);
          }
        });
        return newState;
      });
      setSelectedBookUnitsTitles((prevState) => {
        const newState = { ...prevState };
        bookUnits.content.forEach(({ Id, Title }: any) => {
          if (!newState[Id]) {
            newState[Id] = Title;
          }
        });
        return newState;
      });
    }
  }, [bookUnits]);

  const handleRemoveByChapter = useCallback(() => {
    if (bookUnits && bookUnits.content) {
      setSelectedBookUnits((prevState) => [
        ...prevState.filter(
          (m) => !bookUnits.content.find(({ Id }: any) => Id === m)
        ),
      ]);
      setSelectedBookUnitsTitles((prevState) => {
        const newState = { ...prevState };
        bookUnits.content.forEach(({ Id }: any) => {
          if (newState[Id]) {
            delete newState[Id];
          }
        });
        return newState;
      });
    }
  }, [bookUnits]);

  const handleAdd = (id: string, title: string) => {
    setSelectedBookUnits((prevState) => [...prevState, id]);
    setSelectedBookUnitsTitles((prevState) => {
      const newState = { ...prevState };
      if (!newState[id]) {
        newState[id] = title;
      }
      return newState;
    });
  };
  const handleRemove = (id: string) => {
    setSelectedBookUnits((prevState) => [...prevState.filter((m) => m !== id)]);
    setSelectedBookUnitsTitles((prevState) => {
      const newState = { ...prevState };
      if (newState[id]) {
        delete newState[id];
      }
      return newState;
    });
  };

  const handleMove = (originIndex: number, targetIndex: number) => {
    setSelectedBookUnits((prevState) =>
      update(prevState, {
        $splice: [
          [originIndex, 1],
          [targetIndex, 0, prevState[originIndex]],
        ],
      })
    );
  };

  return (
    <Stack
      justifyContent="space-between"
      sx={{ height: '50vh', width: '90%' }}
      direction="row"
    >
      <Stack
        spacing={0.5}
        alignItems="stretch"
        sx={{ maxHeight: '100%', overflowY: 'scroll', width: '20%' }}
      >
        {CHAPTERS.map((c) => (
          <Button
            variant="contained"
            disableElevation
            key={c.abbr}
            disabled={chapter !== null && chapter.abbr === c.abbr}
            onClick={() => setChapter(c)}
          >
            {c.name}
          </Button>
        ))}
      </Stack>
      <Stack
        spacing={0.5}
        alignItems="stretch"
        sx={{ maxHeight: '100%', overflowY: 'scroll', width: '30%' }}
      >
        {chapter && bookUnits && bookUnits.content ? (
          <>
            <Button onClick={handleAddAll}>
              Select all units from {chapter.abbr}
            </Button>
            <Button onClick={handleRemoveByChapter}>
              Remove any units from {chapter.abbr}
            </Button>
            {bookUnits.content.map((u: any) => (
              <SelectableBookUnit
                key={u.Id}
                {...u}
                isSelected={selectedBookUnits.includes(u.Id)}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))}
          </>
        ) : null}
      </Stack>
      <Stack
        alignItems="stretch"
        sx={{ maxHeight: '100%', overflowY: 'scroll', width: '30%' }}
      >
        {selectedBookUnits.map((id: string, index) => (
          <Sortable
            key={id}
            id={id}
            index={index}
            move={handleMove}
            style={{ width: '100%' }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: '100%',
                bgcolor: 'primary.dark',
                mt: '3px',
                borderRadius: '5px',
              }}
            >
              <Typography
                sx={{ pl: '.5rem' }}
                color="white"
                bgcolor="primary.dark"
                variant="button"
                fontSize=".8rem"
              >
                {selectedBookUnitsTitles[id]}
              </Typography>
            </Stack>
          </Sortable>
        ))}
      </Stack>
    </Stack>
  );
};
