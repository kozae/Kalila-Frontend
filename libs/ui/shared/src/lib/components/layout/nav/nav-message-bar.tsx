import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import LinearProgress from '@mui/material/LinearProgress';
import {
  KalilaLogo,
  kalilaTheme,
  NavMessageBarContext,
  siteMaxWidth,
  sitePadding,
  useLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { NavUserControls } from './user-controls';
import Typography from '@mui/material/Typography';
import { NavbarStore } from './store';

export const NavMessageBar: React.FC = () => {
  //@ts-ignore
  const { messages, color, pageControls } = useContext(NavMessageBarContext);
  const isLargeScreen = useLargeScreenMediaQuery();
  const {
    data: { loggedUser },
    methods: { togglePanel },
  } = useContext(NavbarStore);
  const { push } = useRouter();

  return (
    <Stack
      direction="row"
      bgcolor="white"
      width="100%"
      height="50px"
      alignItems="center"
      justifyContent="center"
      zIndex="20"
      boxShadow={kalilaTheme.shadows[4]}
    >
      <Stack
        direction="row"
        height="100%"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        maxWidth={siteMaxWidth}
        padding={sitePadding}
        color={color}
      >
        <Stack
          height="100%"
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {loggedUser && (
            <IconButton onClick={togglePanel} aria-label="nav-panel">
              <MenuIcon sx={{ color }} />
            </IconButton>
          )}
          <Box
            onClick={() => push('/')}
            sx={{ cursor: 'pointer' }}
            height="100%"
            minWidth="40px"
            p="5px"
          >
            <KalilaLogo color={color} />
          </Box>
          {!messages[0] && (
            <Box p="0.5rem" width="100px">
              <LinearProgress sx={{ color, bgcolor: color }} />
            </Box>
          )}
          {messages[0] && (
            <motion.div
              key={0}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              <Typography
                fontSize={isLargeScreen ? '1.2rem' : '0.8rem'}
                maxWidth="25vw"
                fontWeight="bold"
              >
                {messages[0]}
              </Typography>
            </motion.div>
          )}
          {isLargeScreen && messages[1] && (
            <motion.div
              key={1}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
            >
              <Typography fontSize="1.2rem">&nbsp; {messages[1]}</Typography>
            </motion.div>
          )}
        </Stack>
        {pageControls}
        <NavUserControls />
      </Stack>
    </Stack>
  );
};
