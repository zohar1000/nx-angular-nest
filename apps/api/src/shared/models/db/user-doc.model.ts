export interface UserDoc {
  _id?: number;
  status: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  lastLoginTime: number;
  password: {
    hash: string;
    salt: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
