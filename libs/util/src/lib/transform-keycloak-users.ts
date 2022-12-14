export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  roles: string[];
  email: string;
  picture?: string;
}

export function transformKeycloakUsers(data: any[]): IUser[] {
  return data.map((u) => ({
    firstName: u.firstName,
    lastName: u.lastName,
    username: u.username,
    email: u.email,
    roles: u.attributes?.kalila_role ?? [],
    picture: u.attributes?.picture ? u.attributes.picture[0] : undefined,
  }));
}
