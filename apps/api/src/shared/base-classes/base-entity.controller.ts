import { HttpStatusCodes } from '@shared/enums/http-status-codes.enum';
import { AuthUser } from '../models/auth-user.model';
import { BaseController } from './base.controller';
import { GetItemsResponse } from '@shared/models/get-items-response.model';
import { EntityServiceResponse } from '@api-app/shared/models/entity-service-response.model';

export abstract class BaseEntityController extends BaseController {
  readonly DEFAULT_ERROR_CODE = HttpStatusCodes.DefaultError;
  protected constructor(
    protected entityName = '',
    protected entityService = null,
    errorService = null) {
    super(errorService);
  }

  async getItemsPage(user: AuthUser, body): Promise<EntityServiceResponse> {
    try {
      const response: GetItemsResponse = await this.entityService.getItemsPage(user, body);
      return { isSuccess: true, data: response };
    } catch(e) {
      this.errorService.loge(`${this.constructor.name}: error getting page for ${this.entityName}`, e, user, body);
      return { isSuccess: false, message: e.message };
    }
  }
}
