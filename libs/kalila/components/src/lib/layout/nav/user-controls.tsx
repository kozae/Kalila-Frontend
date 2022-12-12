import styles from './nav.module.scss';
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
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useSession, signIn, signOut } from 'next-auth/react';
import { FC, useRef, useState } from 'react';

const LogOutButton: FC<{ initials: string; picture?: string }> = ({
  initials,
  picture,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
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

  return (
    <div className={styles['nav__control-bar__user-controls']}>
      {picture ? (
        <Avatar alt={initials.toUpperCase()} src={picture} />
      ) : (
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          {initials.toUpperCase()}
        </Avatar>
      )}

      <IconButton
        size="small"
        aria-controls={open ? 'split-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="select user action"
        aria-haspopup="menu"
        color="secondary"
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
              : //@ts-ignore
                session.user.username
          }
          //@ts-ignore
          picture={session.user.picture}
        />
      )}
      {!session && (
        <div className={styles['nav__control-bar__user-controls']}>
          <Button
            onClick={() => signIn('keycloak')}
            size="small"
            color="secondary"
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
