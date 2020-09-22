import { Controller, Get, Post, Request, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ErrorService } from '../../shared/services/error.service';
import { BaseEntityController } from '../../shared/base-classes/base-entity.controller';
import { UserService } from '../../shared/services/entities/user.service';
import { AddUserDto } from './dtos/add-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ItemGetPageDto } from '@api-app/routes/user/dtos/item-get-page.dto';
import { GetItemsRequest } from '@shared/models/get-items-request.model';
import { AuthUser } from '@api-app/shared/models/auth-user.model';


@Controller('/v1/user')
// @UseGuards(RolesGuard)
// @UseGuards(AuthGuard('jwt'))
export class UserController extends BaseEntityController {
  constructor(private readonly userService: UserService, errorService: ErrorService) {
    super('user', userService, errorService);
  }

  @Get('/temp1')
  async temp1() {
    try {
      const response = await this.entityService.temp1();
      return this.successResponse(response);
    } catch(e) {
      this.errorService.loge(`${this.constructor.name}: error getting page for ${this.entityName}`, e);
      return this.errorResponse(e.message);
    }
  }


  /*  @Get('/')
    async getAllUsers() {
      try {
        const response = {  message: 'ok!' };
        return this.successResponse(response);
      } catch(e) {
        return this.errorResponse(e.message);
      }
    }*/


  @Post('/items-page')
  async getUsersPage(@Request() req, @Body() body) {
    return await this.getItemsPage(req.user, body);
  }

  @Get('/')
  async getAllUsers(@Request() req) {
    try {
      // let response;
      // if (req.query && Object.keys(req.query).length > 0) {
      //   response = await this.userService.findByQuery(req.query);
      // } else {
      //   response = await this.userService.getAllUsers();
      // }
      const response = await this.userService.getAllProfiles(req.query);
      return this.successResponse(response);
    } catch(e) {
      this.errorService.loge('error getting user', e, req.query);
      return this.errorResponse(e.message);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id) {
    try {
      const profile = await this.userService.getProfileById(Number(id));
      return this.successResponse(profile);
    } catch(e) {
      this.errorService.loge('error getting user by id', id, e);
      return this.errorResponse(e.message);
    }
  }

  @Post('/')
  async addUser(@Request() req, @Body() dto: AddUserDto) {
    let response;
    try {
      response = await this.userService.addUser(dto);
      if (response.isSuccess) {
        return this.successResponse(response.data);
      } else {
        return this.errorResponse(response.message);
      }
    } catch(e) {
      this.errorService.loge('error adding user', e, req, dto);
      return this.exceptionResponse(e.message);
    }
  }

  @Post('/add-page')
  async addUserGetPage(@Request() req, @Body() dto: ItemGetPageDto) {
    let response;
    try {
      response = { isSuccess: true }; // await this.userService.addUser(dto.doc);
      return await this.getItemsPageAfterItemRequest(response, req.user, dto.getItemsRequest);
    } catch(e) {
      this.errorService.loge('error adding user', e, req, dto);
      return this.exceptionResponse(e.message);
    }
  }

  @Put(':id')
  async updateUser(@Request() req, @Param('id') id, @Body() dto: UpdateUserDto) {
    try {
      await this.userService.updateUser(Number(id), dto);
      return this.successResponse();
    } catch(e) {
      this.errorService.loge('error updating user', e, req, id, dto);
      return this.errorResponse(e.message);
    }
  }

  @Post(':id/edit-page')
  async editUserGetPage(@Request() req, @Param('id') id, @Body() dto: ItemGetPageDto) {
    let response;
    try {
      response = { isSuccess: true };  // await this.userService.updateUser(Number(id), dto.doc);
      return await this.getItemsPageAfterItemRequest(response, req.user, dto.getItemsRequest);
    } catch(e) {
      this.errorService.loge('error adding user', e, req, dto);
      return this.exceptionResponse(e.message);
    }
  }

  @Delete(':id')
  async deleteUser(@Request() req, @Param('id') id) {
    try {
      await this.userService.deleteById(Number(id));
      return this.successResponse();
    } catch(e) {
      this.errorService.loge('error deleting user', e, req, id);
      return this.errorResponse(e.message);
    }
  }

  @Post(':id/delete-page')
  async deleteUserGetPage(@Request() req, @Param('id') id, @Body() dto: ItemGetPageDto) {
    let response;
    try {
      response = { isSuccess: true };  // await await this.userService.deleteById(Number(id));
      return await this.getItemsPageAfterItemRequest(response, req.user, dto.getItemsRequest);
    } catch(e) {
      this.errorService.loge('error adding user', e, req, dto);
      return this.exceptionResponse(e.message);
    }
  }

  async getItemsPageAfterItemRequest(response, user: AuthUser, getItemsRequest: GetItemsRequest) {
    if (response.isSuccess) {
      return await this.getItemsPage(user, getItemsRequest);
    } else {
      return this.errorResponse(response.message);
    }
  }
}
