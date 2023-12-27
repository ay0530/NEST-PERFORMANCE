import { Role } from 'src/user/types/userRole.type'; // userRole 타입(enum) 사용

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'; // 유효성 검사 파이프
import { Reflector } from '@nestjs/core'; // 애플리케이션 인스턴스 생성;
import { AuthGuard } from '@nestjs/passport'; // 특정 경로 접근 제한 가드

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  // ExecutionContext : 현재 실행중인 컨트롤러 및 메서드에 대한 정보 제공
  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    // switchToHttp() : HTTP 특정 작업을 수행할 수 있는 인터페이스 반환
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
