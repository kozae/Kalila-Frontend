import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import ReorderSharpIcon from '@mui/icons-material/ReorderSharp';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';
import { ReactNode, SyntheticEvent, useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import {
  ActiveWorkspace,
  TextEditingWorkspaceContext,
} from '../text-editing-workspace-context';

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const TabIndexWorkspaceNameMap: Record<number, ActiveWorkspace> = {
  0: 'description',
  1: 'layout',
  2: 'lines',
  3: 'transcription',
  4: 'segmentation',
};

export const ToolSpace = () => {
  const { setActiveWorkspace } = useContext(TextEditingWorkspaceContext);
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event: SyntheticEvent, index: number) => {
    setValue(index);
    setActiveWorkspace(TabIndexWorkspaceNameMap[index]);
  };
  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  return (
    <Box sx={{ width: '55%' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="text-editing-tools"
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<InfoTwoToneIcon />} label="Description" />
          <Tab icon={<DashboardTwoToneIcon />} label="Layout" />
          <Tab icon={<ReorderSharpIcon />} label="Lines" />
          <Tab icon={<HistoryEduTwoToneIcon />} label="Transcription" />
          <Tab icon={<TableRowsTwoToneIcon />} label="Segmentation" />
        </Tabs>
      </Box>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          Item Four
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          Item Five
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
};
