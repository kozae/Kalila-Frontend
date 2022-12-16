export interface User extends Realm.Services.MongoDB.Document<any> {
  firstName: string;
  lastName: string;
  picture?: string;
  roles: string[];
  userId?: string;
  username: string;
}
