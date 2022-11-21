import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ICommonFieldProps } from './common-field-props';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import { stringHasValue } from '@frontend/util';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import update from 'immutability-helper';

interface IInputOneIntegerProps extends ICommonFieldProps {
  handleChange: any;
  name: string;
  setFieldTouched: any;
}

export const Commentary = ({
  name,
  value,
  handleChange,
  inputLabel,
  setFieldTouched,
}: IInputOneIntegerProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<string>('');
  const [comments, setComments] = useState<string[]>(
    value ? value.split('\n') : []
  );

  useEffect(() => {
    setFieldTouched(name, true, true);
    handleChange({
      target: { name, value: comments.join('\n') },
    });
  }, [comments]);

  const deleteComment = (i: number) => {
    setComments((oldComments) => update(oldComments, { $splice: [[i, 1]] }));
  };

  const finishAdding = useCallback(() => {
    if (stringHasValue(currentComment)) {
      setComments([...comments, currentComment]);
    }
    setIsAdding(false);
    setCurrentComment('');
  }, [currentComment, comments]);
  return (
    <Stack spacing={1} alignItems="flex-start" width="100%" mb="10px">
      {inputLabel}
      {comments.length === 0 && (
        <Typography variant="body1"> No Comments Present </Typography>
      )}
      {comments.length !== 0 &&
        comments.map((c, i) => (
          <Stack
            key={i}
            direction="row"
            width="100%"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="body1">&#8226; {c}</Typography>
            <IconButton onClick={() => deleteComment(i)} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      {!isAdding && (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          disableElevation
          variant="contained"
          color="secondary"
        >
          Add
        </Button>
      )}
      {isAdding && (
        <TextField
          fullWidth
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          id="new-comment"
          label="New comment"
          variant="standard"
        />
      )}
      {isAdding && (
        <Button
          startIcon={<CheckIcon />}
          onClick={finishAdding}
          disableElevation
          variant="contained"
          color="secondary"
        >
          Done
        </Button>
      )}
    </Stack>
  );
};
