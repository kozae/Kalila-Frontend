import { ISession } from '@frontend/util';

export const verifyAdmin = (user: ISession): boolean => {
  if (user && user.Roles) {
    return user.Roles.includes('admin');
  }
  return false;
};

export const verifyBookUnitTagger = (user: ISession): boolean => {
  if (user && user.Roles) {
    return user.Roles.includes('book_unit_tagger');
  }
  return false;
};
