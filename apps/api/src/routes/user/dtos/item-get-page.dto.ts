import { GetItemsRequest } from '@shared/models/get-items-request.model';

export class ItemGetPageDto {
  readonly doc: any;
  readonly getItemsRequest: GetItemsRequest;
}
