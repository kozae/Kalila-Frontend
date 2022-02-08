import { NextRouter } from 'next/router';

export interface IPathParameters {
  activeLink: string;
}

export const determinePathParameters = ({
  pathname,
}: NextRouter): IPathParameters => {
  switch (pathname) {
    case '/':
      return { activeLink: '' };
    case '/account':
      return { activeLink: 'account' };
    case '/administration':
      return { activeLink: 'administration' };
    case '/administration/manuscript-description':
      return { activeLink: 'administration' };
    case '/administration/pages':
      return { activeLink: 'administration' };
    case '/administration/categorical-attributes':
      return { activeLink: 'administration' };
    case '/manuscript-description':
      return { activeLink: 'manuscript-description' };
    case '/text-editing':
      return { activeLink: 'text-editing' };
    case '/editions':
      return { activeLink: 'editions' };
    case '/image-cycle-analysis':
      return { activeLink: 'image-cycle-analysis' };
    case '/book-analysis':
      return { activeLink: 'book-analysis' };
    case '/visualizations':
      return { activeLink: 'visualizations' };
    case '/error':
      return { activeLink: 'error' };
    case '/404':
      return { activeLink: '404' };
    default:
      return { activeLink: '' };
  }
};
