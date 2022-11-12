import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  IChildrenProp,
  KalilaLogo,
  kalilaTheme,
  useSmallScreenMediaQuery,
  PanelLink,
} from '@frontend/shared-ui';
import styles from './layout.module.scss';
import { EditionsAppContext } from '../context';
import Stack from '@mui/material/Stack';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Portal,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signIn, signOut, useSession } from 'next-auth/react';
import MenuIcon from '@mui/icons-material/Menu';

const LoginButton = () => {
  return (
    <Button
      disableElevation
      variant="contained"
      color="primary"
      onClick={() => signIn('keycloak')}
    >
      Log In
    </Button>
  );
};

const LogoutButton = () => {
  return (
    <IconButton color="warning" onClick={() => signOut()}>
      <ExitToAppIcon />
    </IconButton>
  );
};

export const Layout: React.FC<IChildrenProp> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { showNavbar, editionName } = useContext(EditionsAppContext);
  const { data, status } = useSession();
  const { push, query, events } = useRouter();
  const isSmallScreen = useSmallScreenMediaQuery();
  const showRevalidate =
    data && data.user && data.user.name === 'Mahmoud Kozae';

  const onRevalidate = useCallback(async () => {
    await fetch(`/api/revalidate?id=${query.edition}`);
  }, [query]);

  useEffect(() => {
    events.on('routeChangeStart', () => {
      setOpen(false);
      setLoading(true);
    });
    events.on('routeChangeComplete', () => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading && (
        <Portal>
          <Stack
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bgcolor="rgba(255,255,255, 0.5)"
            zIndex="500"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress size={250} />
          </Stack>
        </Portal>
      )}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {showNavbar && (
          <Stack
            direction="row"
            justifyContent="center"
            zIndex="10"
            boxShadow={kalilaTheme.shadows[4]}
            height="50px"
            width="100%"
          >
            <Stack
              width="100%"
              maxWidth="1600px"
              height="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack
                alignItems="center"
                maxWidth="50vw"
                height="100%"
                direction="row"
              >
                {data && (
                  <IconButton
                    onClick={() => setOpen(true)}
                    size="small"
                    aria-label="nav-panel"
                  >
                    <MenuIcon sx={{ color: 'secondary.main' }} />
                  </IconButton>
                )}
                <Box
                  onClick={() => push('/')}
                  sx={{ cursor: 'pointer' }}
                  height="100%"
                  minWidth="40px"
                  p="5px"
                >
                  <KalilaLogo />
                </Box>
                <Typography
                  className="animate__animated animate__fadeIn"
                  sx={{
                    p: '0.5rem',
                    color: 'secondary.main',
                    fontSize: isSmallScreen ? '0.8rem' : '1.2rem',
                  }}
                >
                  {editionName ?? 'Kalīla and Dimna Editions'}
                </Typography>
              </Stack>

              <Stack direction="row" padding="1rem">
                {showRevalidate && (
                  <IconButton
                    disabled={!query.edition}
                    color="secondary"
                    onClick={() => onRevalidate()}
                  >
                    <CloudSyncIcon />
                  </IconButton>
                )}
                {!data && <LoginButton />}
                {data && <LogoutButton />}
              </Stack>
            </Stack>
          </Stack>
        )}
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
          <Stack
            spacing={1}
            width={isSmallScreen ? '50vw' : '25vw'}
            alignItems="center"
          >
            <Box p="1rem">
              <PanelLink linkRef="" text="Start Page" />
            </Box>
            <Divider sx={{ mt: '10px', mb: '10px' }} />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f2038"
              text="Im Main Edition"
            />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f203b"
              text="Kd Main Edition"
            />
            <PanelLink
              linkRef="63170ccc98cf2f092e5a151c"
              text="Km Main Edition"
            />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f203d"
              text="Lj Main Edition"
            />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f203e"
              text="Lj Colloquium Edition"
            />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f203c"
              text="Lv Main Edition"
            />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f2039"
              text="Mc Main Edition"
            />
            <PanelLink
              linkRef="630a4f54344c39d5cb5f203a"
              text="Oc Main Edition"
            />
          </Stack>
        </Drawer>
      </nav>
      <div className={styles['kalila']}>{children}</div>
    </>
  );
};
