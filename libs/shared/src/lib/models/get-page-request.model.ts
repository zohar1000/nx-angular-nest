import { Paging } from '@sample-app/shared/models/paging.model';
import { SortState } from '@sample-app/shared/models/sort-state.model';

export interface GetPageRequest {
  paging: Paging;
  filter: any;
  sort: SortState;
  isTotalCount: boolean;
}

