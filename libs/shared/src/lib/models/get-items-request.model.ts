import { ItemsPageSettings } from '@shared/models/items-page-settings.model';

export interface GetItemsRequest extends ItemsPageSettings {
  isTotalCount: boolean;
}

