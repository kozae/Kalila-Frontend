import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  determinePathParameters,
  INavbarLink,
  NavbarLinksConfiguration,
  useAppSelector,
  verifyAdmin,
} from '@frontend/shared-ui';
import { INavbarState } from '../store';
import {
  selectSessionStatus,
  selectUser,
} from '../../../../../../../store/src/lib/session';

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
  const status = useAppSelector(selectSessionStatus);
  const user = useAppSelector(selectUser);
  const [links, setLinks] = useState<INavbarLink[]>(init.links);
  const [loggedUser, setLoggedUser] = useState<string | undefined | null>(
    init.loggedUser
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(init.isAdmin);
  useEffect(() => {
    switch (status) {
      case 'authenticated':
        setLoggedUser(user.name);
        if (verifyAdmin(user)) {
          setIsAdmin(true);
          setLinks([
            ...NavbarLinksConfiguration.UserLinks,
            ...NavbarLinksConfiguration.AdminLinks,
          ]);
        } else {
          setIsAdmin(false);
          setLinks(NavbarLinksConfiguration.UserLinks);
        }
        break;
      default:
        setLoggedUser(undefined);
        setLinks([]);
        break;
    }
  }, [status]);

  return { links, loggedUser, isAdmin };
}
