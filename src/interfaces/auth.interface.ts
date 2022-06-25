export interface Session {
  _id?: string;
  refreshToken: string;
  createAt: Date;
  expireAt: Date;
}
