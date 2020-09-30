import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleRate } from '@shared/consts/role.const';
import { Role } from '@shared/enums/role.enum';

@Injectable()
export class CompanyUsersGuard implements CanActivate {
  readonly minRoleRate = RoleRate[Role.Member];

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.user || !req.user.role) return false;
    return RoleRate[req.user.role] >= this.minRoleRate;
  }
}
