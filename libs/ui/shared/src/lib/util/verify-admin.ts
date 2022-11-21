export const verifyAdmin = (user: any): boolean => {
  if (user && user.roles) {
    return user.roles.includes('admin');
  }
  return false;
};
