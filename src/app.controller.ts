import { Controller, Get } from '@nestjs/common'; // 유효성 검사 파이프
import { AppService } from './app.service'; // app 서비스 사용

@Controller() // 라우터 경로
export class AppController {
  constructor(private readonly appService: AppService) {} // 매개변수만 설정하고 본문은 비어있음!!

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
