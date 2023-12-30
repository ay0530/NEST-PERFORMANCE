import { Module } from '@nestjs/common'; // 유효성 검사 파이프
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm'; // typeorm 연결

import { Performance } from './entities/performance.entity'; // performance 엔티티 사용
import { PerformanceController } from './performance.controller'; // performance 컨트롤러 사용
import { PerformanceService } from './performance.service'; // performance 서비스 사용

// Module 데코레이터(imports, controllers, providers 제공)
@Module({
  // imports : 다른 모듈 가져오기
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Performance]), // Performance 엔티티를 현재 모듈에서 사용
  ],
  // providers : 모듈 전체에서 사용할 서비스나 프로바이더 정의(서비스, DB모델, 헬퍼, 팩토리 등)
  providers: [PerformanceService],
  // controllers: HTTP 통신 역할
  controllers: [PerformanceController],
  // exports: 묘듈 내보내기
  exports: [PerformanceService],
})
export class PerformanceModule {}
