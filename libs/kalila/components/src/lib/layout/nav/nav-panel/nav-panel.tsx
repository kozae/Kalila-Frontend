import React, { useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import { NavbarStore } from '../store';
import { EditionsNavPanel } from './editions-nav-panel';
import { TextEditingNavPanel } from './text-editing-nav-panel';
import Stack from '@mui/material/Stack';
import { ManuscriptDescriptionNavPanel } from './manuscript-description-nav-panel';
import { BookAnalysisNavPanel } from './book-analysis-nav-panel';
import { ImageCycleAnalysisNavPanel } from './image-cycle-analysis-nav-panel';
import { VisualizationsNavPanel } from './visualizations-nav-panel';
import { AdministrationNavPanel } from './administration-nav-panel';
import Box from '@mui/material/Box';
import { PanelLink } from './panel-link';
import { useLargeScreenMediaQuery } from '@frontend/shared-ui';

export const NavPanel: React.FC = () => {
  const { data, methods } = useContext(NavbarStore);
  const { isPanelOpen, links } = data;
  const { dismissPanel } = methods;
  const isLargeScreen = useLargeScreenMediaQuery();
  return (
    <Drawer anchor="left" open={isPanelOpen} onClose={dismissPanel}>
      <Stack width={isLargeScreen ? '25vw' : '50vw'} alignItems="center">
        <Box p="1rem">
          <PanelLink linkRef="" text="Start Page" />
        </Box>

        {links.map((link, i) => {
          if (link.Name === 'Editions') {
            return <EditionsNavPanel key={i} />;
          } else if (link.Name === 'Text Editing') {
            return <TextEditingNavPanel key={i} />;
          } else if (link.Name === 'Manuscript Description') {
            return <ManuscriptDescriptionNavPanel key={i} />;
          } else if (link.Name === 'Book Analysis') {
            return <BookAnalysisNavPanel key={i} />;
          } else if (link.Name === 'Image Cycle Analysis') {
            return <ImageCycleAnalysisNavPanel key={i} />;
          } else if (link.Name === 'Visualizations') {
            return <VisualizationsNavPanel key={i} />;
          } else if (link.Name === 'Administration') {
            return <AdministrationNavPanel key={i} />;
          } else {
            return <Box key={i} />;
          }
        })}
      </Stack>
    </Drawer>
  );
};
