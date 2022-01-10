import {NextRouter} from "next/router";

export interface IPathParameters {
  activeLink: string;
  banner: string[]
}

export const determinePathParameters = (router: NextRouter): IPathParameters => {
  switch (router.pathname) {
    case '/':
      return {activeLink: '', banner: ['']};
    case '/account':
      return {activeLink: '/account', banner: ['Account Settings']};
    case '/administration':
      return {activeLink: '/administration', banner: ['Administration']};
    case '/[activity]':
      return {activeLink: router.asPath, banner: [router.asPath]};
    case '/[activity]/[...tool]':
      return {activeLink: router.asPath, banner: [router.asPath]};
    default:
      return {activeLink: '', banner: ['']};
  }
}
