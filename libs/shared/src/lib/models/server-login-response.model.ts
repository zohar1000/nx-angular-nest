import { UserProfile } from '@shared/models/user-profile.model';

export interface ServerLoginResponse {
  isSuccess: boolean;
  user?: UserProfile;
  accessToken?: string
  refreshToken?: string;
  message?: string;
}
