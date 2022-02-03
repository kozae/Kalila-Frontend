import styles from "./nav.module.scss";
import React, {useContext} from "react";
import {stringHasValue} from "@frontend/util";
import {NavbarStore} from "./store";
import {signIn, signOut} from "next-auth/react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {useRouter} from "next/router";


const LogOutButton: React.FC<{ loggedUser: string }> = ({loggedUser}) => {
  const {push} = useRouter();
  const options = ['Sign out', 'Account settings'];
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  // const {isNotXXLScreen} = useContext(MediaQueryWrapper);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

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


  // todo determine initials and secondary text

  // const menuProps: IContextualMenuProps = {
  //   items: [
  //     {
  //       key: 'signOut',
  //       text: 'Sign Out',
  //       iconProps: {iconName: 'UserRemove'},
  //       onClick: () => {
  //         signOut().catch()
  //       }
  //     },
  //     {
  //       key: 'accountSettings',
  //       text: 'Account Settings',
  //       iconProps: {iconName: 'Settings'},
  //       onClick: () => {
  //         push('/account').catch()
  //       }
  //     },
  //   ],
  // };

  return (
    <div className={styles['nav__control-bar__user-controls']}>
      <Avatar sx={{ bgcolor: 'primary' }}>MK</Avatar>
      <ButtonGroup disableElevation variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
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
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );

}

export const NavUserControls: React.FC = () => {
  const {loggedUser} = useContext(NavbarStore).state;
  const logInButton = () => (
    <div className={styles['nav__control-bar__user-controls']}>
      <Button  onClick={() => signIn()} variant="contained" disableElevation endIcon={<LoginIcon />}>
        Sign In"
      </Button>
    </div>
  )

  return stringHasValue(loggedUser) ? <LogOutButton loggedUser={loggedUser as string}/> : logInButton()

}
