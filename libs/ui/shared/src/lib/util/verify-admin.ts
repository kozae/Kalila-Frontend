export const verifyAdmin = (user: any): boolean => {
  if (user && user.roles) {
    return user.roles.includes('Admin');
  }
  return false;
};
