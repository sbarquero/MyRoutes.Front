import type { Session } from './auth.interface';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  rol: string;
  active: boolean;
  sessions: [Session];
  createAt: Date;
  updateAt: Date;
}

export interface UserListDto {
  _id: string;
  name: string;
  email: string;
}
