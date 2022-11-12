import React, { useContext } from 'react';
import Link from 'next/link';
import { NavbarStore } from './store';
import Stack from '@mui/material/Stack';
import MuiLink from '@mui/material/Link';

export const NavLinks: React.FC = () => {
  const { links } = useContext(NavbarStore).data;

  return (
    <Stack direction="row" height="100%" alignItems="center" spacing={5}>
      {links.map((link, i) => (
        <Link href={'/' + link.Ref} key={i}>
          <MuiLink
            sx={{ cursor: 'pointer' }}
            fontSize="1.1rem"
            color="secondary.main"
            underline="hover"
          >
            {link.Name}
          </MuiLink>
        </Link>
      ))}
    </Stack>
  );
};
