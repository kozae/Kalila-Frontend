import {
  verifyAdmin,
  verifyBookUnitTagger,
} from './../../../../util/verify-admin';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  selectSessionStatus,
  selectUser,
  useAppSelector,
} from '../../../../store';
import { determinePathParameters } from '../../../../util';

import { INavbarState } from '../store';
import { INavbarLink, NavbarLinksConfiguration } from '../../../../constants';

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

export function useNavSessionState(init: INavbarState) {
  const authenticated = useAppSelector(selectSessionStatus);
  const user = useAppSelector(selectUser);
  const [links, setLinks] = useState<INavbarLink[]>(init.links);
  const [loggedUser, setLoggedUser] = useState<string | undefined | null>(
    init.loggedUser
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(init.isAdmin);
  useEffect(() => {
    if (authenticated) {
      setLoggedUser(user.name);
      if (verifyAdmin(user)) {
        setIsAdmin(true);
        setLinks([
          ...NavbarLinksConfiguration.UserLinks,
          ...NavbarLinksConfiguration.AdminLinks,
          ...NavbarLinksConfiguration.BookUnitTaggerLinks,
        ]);
      } else if (verifyBookUnitTagger(user)) {
        setIsAdmin(true);
        setLinks([
          ...NavbarLinksConfiguration.BookUnitTaggerLinks,
          ...NavbarLinksConfiguration.UserLinks,
        ]);
      } else {
        setIsAdmin(false);
        if (user.name && user.name.includes('guest')) {
          setLinks(NavbarLinksConfiguration.GuestLinks);
        } else {
          setLinks(NavbarLinksConfiguration.UserLinks);
        }
      }
    } else {
      setLoggedUser(undefined);
      setLinks([]);
    }
  }, [authenticated]);

  return { links, loggedUser, isAdmin };
}
