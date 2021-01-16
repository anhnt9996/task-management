export interface IAuthUSer {
  id: number;
  username: string;
  password: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}
