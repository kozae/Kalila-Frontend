import { selectPageDescription, useAppSelector } from '@frontend/shared-ui';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

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

  return (
    <List sx={{ width: '80%' }}>
      <Item field="Editor" value={value.Editor} bgcolor="#EEEEEE" />
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
