import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../user/entities/user.entity';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }
    
    // Check if user has admin role
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        `User ${user.email} does not have the required admin role`
      );
    }
    
    return true;
  }
}
