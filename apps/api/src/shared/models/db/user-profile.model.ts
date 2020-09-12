export interface UserProfile {
  id: number;
  status: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLoginTime: number;
  accessToken?: string;
  refreshToken?: string;
}
