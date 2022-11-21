import {
  selectPageDescription,
  selectUserPictures,
  useAppSelector,
} from '@frontend/shared-ui';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { stringHasValue } from '@frontend/util';
import React from 'react';

const Item = ({ field, value, bgcolor }: any) => (
  <ListItem
    sx={{ display: 'flex', width: '100%', bgcolor, borderRadius: '5px' }}
  >
    <ListItemText sx={{ width: '50%' }} primary={`${field}:`} />
    <ListItemText
      sx={{ width: '50%', whiteSpace: 'pre-wrap' }}
      primary={value}
    />
  </ListItem>
);

export const ViewDescription = () => {
  const value = useAppSelector(selectPageDescription);
  const picture = useAppSelector((state) =>
    selectUserPictures(state, value.Editor)
  );
  return (
    <List sx={{ width: '80%' }}>
      <ListItem
        sx={{
          display: 'flex',
          width: '100%',
          bgcolor: '#EEEEEE',
          borderRadius: '5px',
        }}
      >
        <ListItemText sx={{ width: '50%' }} primary="Editor" />
        {picture ? (
          <Avatar
            alt={stringHasValue(value.Editor) ? value.Editor.toUpperCase() : ''}
            src={picture}
          />
        ) : (
          <Avatar sx={{ bgcolor: 'primary.light', color: 'white' }}>
            {stringHasValue(value.Editor) ? value.Editor.toUpperCase() : ''}
          </Avatar>
        )}
      </ListItem>
      <Item field="EditionProgress" value={value.EditionProgress} />
      <Item field="Tags" value={value.Tags.join(', ')} bgcolor="#EEEEEE" />
      <Item
        field="Present Page Numbering"
        value={value.PresentPageNumbering.join(', ')}
      />
      <Item field="Pagination" value={value.Pagination} bgcolor="#EEEEEE" />
      <Item field="Foliation" value={value.Foliation} />
      <Item
        field="Commentary"
        value={value.AdditionalCommentary}
        bgcolor="#EEEEEE"
      />
    </List>
  );
};
