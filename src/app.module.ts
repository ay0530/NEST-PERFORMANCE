import Joi from 'joi'; // 유효성 검사 라이브러리
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'; // TypeOrm의 DB 필드명을 스네이크 케이스로 변환

import { Module } from '@nestjs/common'; // 유효성 검사 파이프
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수 및 구성 관리
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // typeorm 연결

import { AuthModule } from './auth/auth.module';
import { Performance } from './performance/entities/performance.entity'; // performance 엔티티 사용
import { PerformanceModule } from './performance/performance.module'; // performance 모듈 사용
import { User } from './user/entities/user.entity'; // user 엔티티 사용
import { UserModule } from './user/user.module'; // user 모듈 사용
import { ReservationModule } from './reservation/reservation.module'; // reservation 모듈 사용
import { Reservation } from './reservation/entities/reservation.entity'; // reservation 모듈 사용
import { PointModule } from './point/point.module'; // point 모듈 사용
import { Point } from './point/entites/point.entity'; // point 모듈 사용

const typeOrmModuleOptions = {
  useFactory: async (
    // ConfigService : 환경 변수 값 조회
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    //
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    // configService.get : 환경 변수 값 조회
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Performance, Reservation, Point], // 테이블 명
    synchronize: configService.get('DB_SYNC'), // DB 스키마 자동 동기화
    logging: true, // SQL 로그 출력 여부
  }),
  inject: [ConfigService], // useFactory에서 ConfigService를 사용할 수 있도록 의존성 주입
};

// Module 데코레이터(imports, controllers, providers 제공)
@Module({
  // imports : 다른 모듈 가져오기
  imports: [
    // .forRoot, isGlobal, validationSchema는 ConfigModule 소속
    ConfigModule.forRoot({
      isGlobal: true, // 모듈 전역 설정
      // Joi로 유효성 검사
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PerformanceModule,
    ReservationModule,
    PointModule,
  ],
  // controllers: HTTP 통신 역할
  controllers: [],
  // providers : 모듈 전체에서 사용할 서비스나 프로바이더 정의(서비스, DB모델, 헬퍼, 팩토리 등)
  providers: [],
})
export class AppModule {}
