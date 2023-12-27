import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service'; // team 서비스 사용

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers : 모듈 전체에서 사용할 서비스나 프로바이더 정의(서비스, DB모델, 헬퍼, 팩토리 등)
      providers: [TeamService],
    }).compile();

    service = module.get<TeamService>(TeamService); // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
