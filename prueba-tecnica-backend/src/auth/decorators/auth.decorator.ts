import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleProtected } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  );
}
