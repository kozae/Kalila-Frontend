export const verifyAdmin = (user: any): boolean => {
  if (user && user.roles) {
    return user.roles.includes('admin');
  }
  return false;
};

export const verifyBookUnitTagger = (user: any): boolean => {
  if (user && user.roles) {
    return user.roles.includes('book_unit_tagger');
  }
  return false;
};
