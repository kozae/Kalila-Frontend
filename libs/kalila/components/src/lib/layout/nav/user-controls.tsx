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
import { FC, useCallback, useRef, useState } from 'react';
import { useRealmApp } from '@frontend/kalila/real-app';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  transformRealUser,
  useKalilaSession,
  useKalilaSessionMethods,
} from '../../contexts';
import * as Realm from 'realm-web';

const LogOutButton: FC<{
  initials: string;
  picture?: string;
  onSignOut: () => Promise<void>;
}> = ({ initials, picture, onSignOut }) => {
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
                  <MenuItem sx={{ fontSize: '1rem' }} onClick={onSignOut}>
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
  const { app } = useRealmApp();
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const { session } = useKalilaSession();
  const { loadSession, clearSession } = useKalilaSessionMethods();
  const onSignIn = useCallback(
    async (email: string | undefined, pass: string | undefined) => {
      if (app && email && pass) {
        const credentials = Realm.Credentials.emailPassword(email, pass);
        setSignInModalOpen(false);
        const user = await app!.logIn(credentials);
        loadSession(transformRealUser(user));
      }
    },
    [app]
  );

  const onSignOut = useCallback(async () => {
    if (app) {
      await app!.currentUser?.logOut();
      clearSession();
    }
  }, [app?.currentUser]);

  return (
    <>
      {session && (
        <LogOutButton
          initials={
            session.Username && session.Username.includes('guest')
              ? 'GST'
              : session.Username
          }
          picture={session.Picture}
          onSignOut={onSignOut}
        />
      )}
      {!app?.currentUser && (
        <div className={styles['nav__control-bar__user-controls']}>
          <Button
            onClick={() => setSignInModalOpen(true)}
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
      <Dialog open={signInModalOpen} onClose={() => setSignInModalOpen(false)}>
        <DialogContent>
          <TextField
            inputRef={emailRef}
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            inputRef={passRef}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignInModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() =>
              onSignIn(emailRef?.current?.value, passRef?.current?.value)
            }
          >
            Sign in
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
