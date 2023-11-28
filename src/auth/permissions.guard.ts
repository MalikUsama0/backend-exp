import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly requiredPermission: string,
    private readonly requiredModule: string,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const hasAccess = user.permissions.some(
      (ele) =>
        ele.title === this.requiredPermission &&
        ele.module === this.requiredModule,
    );
    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource.',
      );
    }
    return true;
  }
}
