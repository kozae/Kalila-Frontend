import styles from './nav.module.scss';
import React, { useContext } from 'react';
import { stringHasValue } from '@frontend/util';
import { NavbarStore } from './store';
import { signIn, signOut } from 'next-auth/react';
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
import SettingsIcon from '@mui/icons-material/Settings';
import { kalilaTheme } from '@frontend/shared-ui';

const LogOutButton: React.FC<{ loggedUser: string }> = ({ loggedUser }) => {
  const { push } = useRouter();
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
      <Avatar sx={{ bgcolor: kalilaTheme.palette.primary.main }}>MK</Avatar>
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
                  <MenuItem
                    sx={{ fontSize: '1rem' }}
                    onClick={() => signOut().catch()}
                  >
                    <ExitToAppIcon color="warning" /> &nbsp; Sign out
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '1rem' }}
                    onClick={() =>
                      push('/account')
                        .then(() => setOpen(false))
                        .catch()
                    }
                  >
                    <SettingsIcon color="primary" /> &nbsp; Account Settings
                  </MenuItem>
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
  const { loggedUser } = useContext(NavbarStore).data;
  const logInButton = () => (
    <div className={styles['nav__control-bar__user-controls']}>
      <Button
        onClick={() => signIn()}
        variant="contained"
        disableElevation
        endIcon={<LoginIcon />}
      >
        Sign In
      </Button>
    </div>
  );

  return stringHasValue(loggedUser) ? (
    <LogOutButton loggedUser={loggedUser as string} />
  ) : (
    logInButton()
  );
};
