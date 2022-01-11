import {NextRouter} from "next/router";

export interface IPathParameters {
  activeLink: string;
  messages: [string | undefined, string | undefined]
}

export const determinePathParameters = ({pathname}: NextRouter): IPathParameters => {
  switch (pathname) {
    case '/':
      return {activeLink: '', messages: ['Home', undefined]};
    case '/account':
      return {activeLink: 'account', messages: ['Account Settings', undefined]};
    case '/administration':
      return {activeLink: 'administration', messages: ['Administration', undefined]};
    case '/manuscript-description':
      return {activeLink: 'manuscript-description', messages: ['Manuscript Description:', 'View Documents']};
    case '/text-editing':
      return {activeLink: 'text-editing', messages: ['Text Editing:', 'View Pages']};
    case '/editions':
      return {activeLink: 'editions', messages: ['Editions', undefined]};
    case '/image-cycle-analysis':
      return {activeLink: 'image-cycle-analysis', messages: ['Image Cycle Analysis:', 'View Documents']};
    case '/book-analysis':
      return {activeLink: 'book-analysis', messages: ['Book Analysis:', 'View Narrative Units']};
    case '/visualizations':
      return {activeLink: 'visualizations', messages: ['Visualizations', undefined]};
    case '/error':
      return {activeLink: 'error', messages: ['Something Unexpected Happened', undefined]};
    case '/404':
      return {activeLink: '404', messages: ['Page Not Found', undefined]};
    default:
      return {activeLink: '', messages: [undefined, undefined]};
  }
}
