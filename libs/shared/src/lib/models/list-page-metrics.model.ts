import { PagingMetrics } from '@sample-app/shared/models/paging-metrics.model';
import { SortMetrics } from '@sample-app/shared/models/sort-metrics.model';

export interface ListPageMetrics {
  paging: PagingMetrics;
  filter: any;
  sort: SortMetrics;
}

