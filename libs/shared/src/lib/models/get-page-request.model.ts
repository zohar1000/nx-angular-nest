import { PageSettings } from '@shared/models/page-settings.model';

export interface GetPageRequest extends PageSettings {
  isTotalCount: boolean;
}

