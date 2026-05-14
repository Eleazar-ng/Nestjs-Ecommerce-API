
export interface CreateRefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
}