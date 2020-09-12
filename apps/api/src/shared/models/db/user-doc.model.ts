export interface UserDoc {
  _id?: number;
  status: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLoginTime: number;
  password: {
    hash: string;
    salt: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
