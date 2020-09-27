import { ListPageMetrics } from '@shared/models/list-page-metrics.model';

export interface GetItemsRequest extends ListPageMetrics {
  isTotalCount: boolean;
}

