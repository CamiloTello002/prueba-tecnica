import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../user/entities/user.entity';
import { META_ROLES } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: UserRole[] = this.reflector.get(META_ROLES, context.getHandler());
    
    // If no roles are required, allow access
    if (!validRoles || validRoles.length === 0) return true;
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new BadRequestException('User not found in request');
    
    // Check if user has any of the required roles
    const hasRole = validRoles.some(role => user.role === role);
    
    if (!hasRole)
      throw new ForbiddenException(
        `User ${user.email} does not have the required roles: [${validRoles}]`
      );
    
    return true;
  }
}
