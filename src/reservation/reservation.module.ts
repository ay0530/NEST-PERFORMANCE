import { Module } from '@nestjs/common'; // 유효성 검사 파이프
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

import { ConfigService } from '@nestjs/config'; // 환경 변수 및 구성 관리
import { JwtModule } from '@nestjs/jwt'; // jwt 사용
import { TypeOrmModule } from '@nestjs/typeorm'; // typeorm 연결

import { UserModule } from '../user/user.module'; // user 모듈 사용
import { PerformanceModule } from '../performance/performance.module';
import { Reservation } from './entities/reservation.entity'; // reservation 엔티티 사용

// Module 데코레이터(imports, controllers, providers 제공)
@Module({
  // imports : 다른 모듈 가져오기
  imports: [
    // JwtModule.registerAsync : JWT 모듈을 비동기로 설정
    JwtModule.registerAsync({
      // ConfigService : 환경 변수 값 조회
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'), // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
      }),
      inject: [ConfigService], // useFactory에서 ConfigService를 사용할 수 있도록 의존성 주입
    }),
    UserModule,
    PerformanceModule,
    TypeOrmModule.forFeature([Reservation]), // Reservation 엔티티를 현재 모듈에서 사용
  ],
  // providers : 모듈 전체에서 사용할 서비스나 프로바이더 정의(서비스, DB모델, 헬퍼, 팩토리 등)
  providers: [ReservationService],
  // controllers: HTTP 통신 역할
  controllers: [ReservationController],
  // exports: 묘듈 내보내기
  exports: [ReservationService],
})
export class ReservationModule {}
