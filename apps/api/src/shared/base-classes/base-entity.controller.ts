import { HttpStatusCodes } from '../enums/http-status-codes.enum';
import { AuthUser } from '../models/auth-user.model';
import { BaseController } from './base.controller';

export abstract class BaseEntityController extends BaseController {
  readonly DEFAULT_ERROR_CODE = HttpStatusCodes.DefaultError;
  protected constructor(
    protected entityName = '',
    protected entityService = null,
    errorService = null) {
    super(errorService);
  }

  async getItemsPage(user: AuthUser, body) {
    try {
      const response = await this.entityService.getItemsPage(user, body);
      return this.successResponse(response);
    } catch(e) {
      this.errorService.loge(`${this.constructor.name}: error getting page for ${this.entityName}`, e, user, body);
      return this.errorResponse(e.message);
    }
  }

  async getFilerLineData(user: AuthUser, body) {
    try {
      const data = await this.entityService.getFilterLineData(body);
      return this.successResponse(data);
    } catch(e) {
      this.errorService.loge(`${this.constructor.name}: error getting filter line data for ${this.entityName}`, e, user, body);
      return this.errorResponse(e.message);
    }
  }

  async getDownloadFile(user: AuthUser, body) {
    try {
      const response = await this.entityService.getItemsPage(user, body);
      return this.successResponse(response);
    } catch(e) {
      this.errorService.loge(`${this.constructor.name}: error getting download file for ${this.entityName}`, e, user, body);
      return this.errorResponse(e.message);
    }
  }
}
