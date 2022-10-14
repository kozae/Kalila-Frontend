import Portal from '@mui/material/Portal';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {
  useAuxiliarySurfacesData,
  useAuxiliarySurfacesMethods,
} from '../../contexts';
import { SxProps } from '@mui/system';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ReactNode } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AbcIcon from '@mui/icons-material/Abc';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

const style: SxProps = {
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 'fit-content',
  maxHeight: '100vh',
  boxShadow: 24,
  borderRadius: '10px',
  bgcolor: 'white',
};

const Hint = ({ children, icon }: { children: ReactNode; icon: ReactNode }) => (
  <ListItem>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
      {children}
    </ListItemText>
  </ListItem>
);

export const SearchHints = () => {
  const { showSearchHints } = useAuxiliarySurfacesData();
  const { setShowSearchHints } = useAuxiliarySurfacesMethods();
  const onDismiss = () => setShowSearchHints(false);
  return (
    <Portal>
      <Modal
        sx={{
          zIndex: 100,
        }}
        open={showSearchHints}
        onClose={onDismiss}
      >
        <Box sx={style}>
          <Stack width="100%" height="fit-content" maxHeight="100vh">
            <DialogHeading color="info.light" onDismiss={onDismiss}>
              <Typography fontSize="1.3rem" color="white">
                Search Hints
              </Typography>
            </DialogHeading>
          </Stack>
          <List dense={true}>
            <Hint icon={<FormatListNumberedIcon />}>
              To scroll to a unit number, enter digits in the search box. The
              search is for ordinal numbers (the numbers to the left of the
              round braces) and not structural numbers.
            </Hint>
            <Hint icon={<ImageIcon />}>
              To highlight image locations, if any, type in ':I'.
            </Hint>
            <Hint icon={<DescriptionIcon />}>
              To highlight words at page breaks, type in ':P'.
            </Hint>
            <Hint icon={<AbcIcon />}>
              To search unit titles, enter Latin characters. The minimum valid
              search starts at 3 characters.
            </Hint>
            <Hint icon={<PlagiarismIcon />}>
              To search content, enter Arabic characters. The minimum valid
              search starts at 3 characters. You can combine multiple search
              phrases with an ampersand '&'.
            </Hint>
          </List>
        </Box>
      </Modal>
    </Portal>
  );
};
