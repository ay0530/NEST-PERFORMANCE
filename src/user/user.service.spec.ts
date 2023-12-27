import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service'; // user 서비스 사용

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers : 모듈 전체에서 사용할 서비스나 프로바이더 정의(서비스, DB모델, 헬퍼, 팩토리 등)
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService); // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
