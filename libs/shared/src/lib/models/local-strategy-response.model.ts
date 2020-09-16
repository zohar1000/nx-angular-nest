import { UserProfile } from './user-profile.model';
import { UserDoc } from '@shared/models/user-doc.model';

export interface LocalStrategyResponse {
  isLoginSuccess: boolean;
  message?: string;
  userDoc?: UserDoc;
  user?: UserProfile;
}
