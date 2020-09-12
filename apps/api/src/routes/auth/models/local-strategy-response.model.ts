import { UserDoc } from '../../../shared/models/db/user-doc.model';
import { UserProfile } from '../../../shared/models/db/user-profile.model';

export interface LocalStrategyResponse {
  isLoginSuccess: boolean;
  message?: string;
  userDoc?: UserDoc;
  user?: UserProfile;
}
