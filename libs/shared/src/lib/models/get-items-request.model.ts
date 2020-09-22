import { ListPageSettings } from '@shared/models/list-page-settings.model';

export interface GetItemsRequest extends ListPageSettings {
  isTotalCount: boolean;
}

