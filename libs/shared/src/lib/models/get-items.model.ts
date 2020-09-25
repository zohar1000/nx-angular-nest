import { GetItemsRequest } from '@shared/models/get-items-request.model';
import { GetItemsOptions } from '@shared/models/get-items-options.model';

export interface GetItems {
  request: GetItemsRequest,
  options: GetItemsOptions
}

