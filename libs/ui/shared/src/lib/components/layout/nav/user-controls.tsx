import styles from './nav.module.scss';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { kalilaTheme } from '@frontend/shared-ui';
import { useSession, signIn, signOut } from 'next-auth/react';

const LogOutButton: React.FC<{ initials: string }> = ({ initials }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  // todo determine initials

  return (
    <div className={styles['nav__control-bar__user-controls']}>
      <Avatar sx={{ bgcolor: kalilaTheme.palette.primary.main }}>
        {initials}
      </Avatar>
      <IconButton
        size="small"
        aria-controls={open ? 'split-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="select user action"
        aria-haspopup="menu"
        color="primary"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  <MenuItem sx={{ fontSize: '1rem' }} onClick={() => signOut()}>
                    <ExitToAppIcon color="warning" /> &nbsp; Sign out
                  </MenuItem>
                  {/*<MenuItem*/}
                  {/*  sx={{ fontSize: '1rem' }}*/}
                  {/*  onClick={() =>*/}
                  {/*    push('/account')*/}
                  {/*      .then(() => setOpen(false))*/}
                  {/*      .catch()*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <SettingsIcon color="primary" /> &nbsp; Account Settings*/}
                  {/*</MenuItem>*/}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export const NavUserControls: React.FC = () => {
  const { data: session, status } = useSession();
  if (status === 'loading') return <div>Loading...</div>;
  return (
    <>
      {session && (
        <LogOutButton
          initials={
            session.user?.name && session.user?.name.includes('guest')
              ? 'GST'
              : 'MK'
          }
        />
      )}
      {!session && (
        <div className={styles['nav__control-bar__user-controls']}>
          <Button
            onClick={() => signIn('keycloak')}
            variant="contained"
            disableElevation
            endIcon={<LoginIcon />}
          >
            Sign In
          </Button>
        </div>
      )}
    </>
  );
};
