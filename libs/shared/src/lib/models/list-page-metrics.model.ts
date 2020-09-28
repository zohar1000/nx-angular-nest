import { PagingMetrics } from '@sample-app/shared/models/paging-metrics.model';
import { SortMetrics } from '@sample-app/shared/models/sort-metrics.model';

export interface ListPageMetrics {
  filter: any;
  paging: PagingMetrics;
  sort: SortMetrics;
}

