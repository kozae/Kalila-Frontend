import { IKalilaUser } from '@frontend/util';

export const verifyAdmin = (user: IKalilaUser): boolean => {
  if (user && user.roles) {
    return user.roles.includes('admin');
  }
  return false;
};
