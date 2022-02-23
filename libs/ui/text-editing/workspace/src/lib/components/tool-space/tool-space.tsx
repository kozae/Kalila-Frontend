import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import ReorderSharpIcon from '@mui/icons-material/ReorderSharp';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';
import React, { ReactNode, SyntheticEvent, useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import {
  ActiveWorkspace,
  TextEditingWorkspaceContext,
} from '../../text-editing-workspace-context';
import { AnimatePresence, motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { LayoutAnalysisTool } from '@frontend/ui/text-editing/layout-analysis';

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
      style={{
        width: '100%',
        height: 'calc(100vh - 110px - 10px - 72px)',
      }}
    >
      {value === index && (
        <Paper
          sx={{
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </Paper>
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

// export interface IToolSpaceProps {
// }

export const ToolSpace = () => {
  const {
    loading,
    toolSpaceContainerRef,
    setActiveWorkspace,
    onElementHovered,
  } = useContext(TextEditingWorkspaceContext);
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
    <Box ref={toolSpaceContainerRef} sx={{ width: '50%' }}>
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
      <AnimatePresence exitBeforeEnter>
        {loading ? (
          <motion.div
            key="facsimile-loading"
            style={{
              width: '100%',
              height: 'calc(100vh - 110px - 10px - 72px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(153, 153, 153, 0.3)',
              }}
            >
              <CircularProgress size={160} />
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="tool-spaces"
            style={{
              width: '100%',
              height: 'calc(100vh - 110px - 10px - 72px)',
            }}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 1, ease: 'easeIn' }}
          >
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                Item One
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <LayoutAnalysisTool onElementHovered={onElementHovered} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
