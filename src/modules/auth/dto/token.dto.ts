export class TokensDto {
  accessToken!: string;
  refreshToken!: string;
  tokenType!: string;
  expiresIn!: number;
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}