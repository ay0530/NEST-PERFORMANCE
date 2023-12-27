import { createParamDecorator, ExecutionContext } from '@nestjs/common'; // 유효성 검사 파이프

// createParamDecorator : 파라미터 데코레이터 생성
export const UserInfo = createParamDecorator(
  // ExecutionContext : 현재 실행중인 컨트롤러 및 메서드에 대한 정보 제공
  // data : 데코레이터에 전달될 데이터
  // ctx : 현재 요청의 실행 컨텍스트, HTTP 요청에 접근 가능
  (data: unknown, ctx: ExecutionContext) => {
    // switchToHttp() : HTTP 특정 작업을 수행할 수 있는 인터페이스 반환
    // getRequest() : 요청 객체 추출
    const request = ctx.switchToHttp().getRequest();
    return request.user ? request.user : null;
  },
);
