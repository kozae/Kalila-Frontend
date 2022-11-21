import {
  AdministrationNavPanel,
  BookAnalysisNavPanel,
  EditionsNavPanel,
  ImageCycleAnalysisNavPanel,
  KalilaLogo,
  ManuscriptDescriptionNavPanel,
  NavbarLinksConfiguration,
  selectUser,
  TextEditingNavPanel,
  useAppSelector,
  useNavbarMessage,
  verifyAdmin,
  VisualizationsNavPanel,
  withTransition,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';

export function Index() {
  const messages = useMemo(() => ['Home', undefined] as [string, string], []);
  useNavbarMessage(messages, undefined);
  const user = useAppSelector(selectUser);
  const links = useMemo(() => {
    if (user && user.name) {
      if (verifyAdmin(user)) {
        return [
          ...NavbarLinksConfiguration.AdminLinks,
          ...NavbarLinksConfiguration.UserLinks,
        ];
      }
      return NavbarLinksConfiguration.UserLinks;
    } else {
      return [];
    }
  }, [user]);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      width="100%"
      height="calc(100vh - 50px)"
    >
      <Stack
        m="10px"
        spacing={1}
        alignItems="center"
        sx={{ width: user && user.name ? '45%' : '100%' }}
      >
        <Box maxWidth="100%" height="150px">
          <KalilaLogo text="Kalila 2.0" />
        </Box>
        <Typography variant="h2">Platform for Textual Scholarship</Typography>
      </Stack>
      {user && user.name && (
        <Stack height="100%" mt="10px" width="40%" sx={{ overflowY: 'scroll' }}>
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
      )}
    </Stack>
  );
}

export default withTransition(Index, {});
