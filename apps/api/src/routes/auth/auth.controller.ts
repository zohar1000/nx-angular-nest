import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorService } from '../../shared/services/error.service';
import { BaseEntityController } from '../../shared/base-classes/base-entity.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../../shared/services/entities/user.service';
import { LoginDto } from './dtos/login.dto';
import { LocalStrategyResponse } from '@shared/models/local-strategy-response.model';

@Controller('/v1/auth')
export class AuthController extends BaseEntityController {
  constructor(private readonly authService: AuthService,
              private readonly userService: UserService,
              errorService: ErrorService) {
    super('auth', authService, errorService);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('permissions')
  async permissions(@Request() req) {
    try {
      const loggedInUser = await this.authService.permissions(req.user);
      return this.successResponse(loggedInUser);
    } catch(e) {
      return this.exceptionResponse(e.message, 401);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() dto: LoginDto) {
    try {
    const resp: LocalStrategyResponse = await this.authService.login(dto, req.user as LocalStrategyResponse);
      return this.successResponse(resp);
    } catch(e) {
      return this.errorResponse(e.message);
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Body() body) {
    try {
      const response: any = await this.authService.refresh(body.refreshToken);
      return this.successResponse({ isSuccess: true, ...response });
    } catch(e) {
      // return this.exceptionResponse(e.message, 401);
      return this.successResponse({ isSuccess: false });
    }
  }
/*
  @Post('forgot-password')
  async forgotPassword(@Body() body) {
    try {
      await this.authService.forgotPassword(body.email);
      return this.successResponse();
    } catch (e) {
      this.errorService.loge('error in forgot password at controller', e, body);
      return this.errorResponse(e.message);
    }
  }
*/
}
