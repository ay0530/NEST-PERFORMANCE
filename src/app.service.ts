import { Injectable } from '@nestjs/common'; // 유효성 검사 파이프

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
