import { PagingSettings } from '@sample-app/shared/models/paging-settings.model';
import { SortSettings } from '@sample-app/shared/models/sort-settings.model';

export interface PageSettings {
  paging: PagingSettings;
  filter: any;
  sort: SortSettings;
}

