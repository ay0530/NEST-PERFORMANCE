import { ValidationPipe } from '@nestjs/common'; // 유효성 검사 파이프
import { NestFactory } from '@nestjs/core'; // 애플리케이션 인스턴스 생성

import { AppModule } from './app.module'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 애플리케이션 인스턴스 생성

  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터를 DTO 타입으로 설정
    }),
  );

  await app.listen(3000);
}

bootstrap();
