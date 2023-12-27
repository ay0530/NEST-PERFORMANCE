import { Role } from 'src/user/types/userRole.type'; // userRole 타입(enum) 사용

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'; // 유효성 검사 파이프
import { Reflector } from '@nestjs/core'; // 애플리케이션 인스턴스 생성;
import { AuthGuard } from '@nestjs/passport'; // 특정 경로 접근 제한 가드

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  // Reflector : 런타임에 메타데이터를 검색하는 기능 제공
  constructor(private reflector: Reflector) {
    super();
  }

  // ExecutionContext : 현재 실행중인 컨트롤러 및 메서드에 대한 정보 제공
  async canActivate(context: ExecutionContext) {
    // canActivate : 요청이 주어진 조건을 만족하는지 확인 후 true, false를 반환, 가드가 요청을 처리하게 전에 호출됨
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    // getAllAndOverride : reflector를 통해 메타데이터 키('roles')에 대한 값을 조회 후 반환
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
      context.getHandler(), // 현재 실행 중인 컨트롤러의 메서드에 대한 정보를 반환(e.g. @get 라우터를 실행중일 경우 @get 라우터의 "fineOne"라는 함수 반환!)
      context.getClass(), // 현재 실행 중인 핸들러를 포함하는 컨트롤러 클래스에 대한 정보를 반환
    ]);
    if (!requiredRoles) {
      return true;
    }

    // switchToHttp() : HTTP 특정 작업을 수행할 수 있는 인터페이스 반환
    const { user } = context.switchToHttp().getRequest();
    // some : 배열에서 주어진 조건을 만족하는지 검사 후 true, false 반환
    return requiredRoles.some((role) => user.role === role);
  }
}
