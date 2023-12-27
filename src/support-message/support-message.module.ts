import { Module } from '@nestjs/common'; // 유효성 검사 파이프
import { TypeOrmModule } from '@nestjs/typeorm'; // typeorm 연결

import { SupportMessage } from './entities/support-message.entity'; // support-message 엔티티 사용
import { SupportMessageController } from './support-message.controller'; // support-message 컨트롤러 사용
import { SupportMessageService } from './support-message.service'; // support-message 서비스 사용

// Module 데코레이터(imports, controllers, providers 제공)
@Module({
  // imports : 다른 모듈 가져오기
  imports: [TypeOrmModule.forFeature([SupportMessage])], // SupportMessage 엔티티를 현재 모듈에서 사용
  // providers : 모듈 전체에서 사용할 서비스나 프로바이더 정의(서비스, DB모델, 헬퍼, 팩토리 등)
  providers: [SupportMessageService],
  // controllers: HTTP 통신 역할
  controllers: [SupportMessageController],
})
export class SupportMessageModule {}
