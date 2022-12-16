import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { INavbarState } from '../store';
import { ISession } from '@frontend/util';
import {
  determinePathParameters,
  verifyAdmin,
  verifyBookUnitTagger,
} from '@frontend/shared-ui';
import {
  INavbarLink,
  NavbarLinksConfiguration,
} from '../../navbar-links-configuration';

export function useRouteState(
  init: INavbarState,
  sideEffects: Array<() => void>
) {
  const [activeLink, setActiveLink] = useState<string>(init.activeLink);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const pathParams = determinePathParameters(router);
      setTimeout(() => {
        setActiveLink(pathParams.activeLink);
      }, 1000);
      sideEffects.forEach((effect) => effect());
    }
  }, [router.isReady, router.pathname]);
  return { activeLink };
}

export function useNavSessionState(
  init: INavbarState,
  authenticated: boolean,
  session: ISession | null
) {
  const [links, setLinks] = useState<INavbarLink[]>(init.links);
  const [loggedUser, setLoggedUser] = useState<string | undefined | null>(
    init.loggedUser
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(init.isAdmin);
  useEffect(() => {
    if (authenticated && session) {
      setLoggedUser(session.Username);
      if (verifyAdmin(session)) {
        setIsAdmin(true);
        setLinks([
          ...NavbarLinksConfiguration.UserLinks,
          ...NavbarLinksConfiguration.AdminLinks,
          ...NavbarLinksConfiguration.BookUnitTaggerLinks,
        ]);
      } else if (verifyBookUnitTagger(session)) {
        setIsAdmin(true);
        setLinks([
          ...NavbarLinksConfiguration.BookUnitTaggerLinks,
          ...NavbarLinksConfiguration.UserLinks,
        ]);
      } else {
        setIsAdmin(false);
        if (session.Username && session.Username.includes('guest')) {
          setLinks(NavbarLinksConfiguration.GuestLinks);
        } else {
          setLinks(NavbarLinksConfiguration.UserLinks);
        }
      }
    } else {
      setLoggedUser(undefined);
      setLinks([]);
    }
  }, [authenticated, session]);

  return { links, loggedUser, isAdmin };
}
