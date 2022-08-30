import React, { useContext } from 'react';
import { IChildrenProp, KalilaLogo, kalilaTheme } from '@frontend/shared-ui';
import styles from './layout.module.scss';
import { EditionsAppContext } from '../context';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

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
  const { showNavbar, editionName } = useContext(EditionsAppContext);
  const { data, status } = useSession();
  const { push } = useRouter();
  return (
    <>
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
            height="60px"
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
              <div className={styles['logo']} onClick={() => push('/')}>
                <KalilaLogo />
              </div>
              <Link href="/">
                <Typography sx={{ cursor: 'pointer' }} variant="h2">
                  Kalīla and Dimna Editions
                </Typography>
              </Link>
              <Box padding="1rem">
                {!data && <LoginButton />}
                {data && <LogoutButton />}
              </Box>
            </Stack>
          </Stack>
        )}
        <Stack
          direction="row"
          justifyContent="center"
          width="100%"
          bgcolor="primary.main"
          height="50px"
        >
          <Stack
            width="100%"
            maxWidth="1600px"
            justifyContent="flex-start"
            alignItems="center"
            direction="row"
            height="100%"
          >
            {editionName && (
              <Typography
                className="animate__animated animate__fadeIn"
                sx={{
                  p: '0.5rem',
                  color: 'white',
                  fontSize: '1.2rem',
                }}
              >
                {editionName}
              </Typography>
            )}
          </Stack>
        </Stack>
      </nav>
      <div className={styles['kalila']}>{children}</div>
    </>
  );
};
