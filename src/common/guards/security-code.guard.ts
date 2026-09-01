import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SecurityCodeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const code = request.headers['x-security-code'] || request.body?.securityCode || request.query?.securityCode;

    if (code !== '1234') {
      throw new ForbiddenException('Código de seguridad 1234 incorrecto o no proporcionado (UC6/UC7/UC9)');
    }

    return true;
  }
}
