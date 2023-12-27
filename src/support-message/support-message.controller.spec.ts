import { Test, TestingModule } from '@nestjs/testing';
import { SupportMessageController } from './support-message.controller'; // support-message 컨트롤러 사용

describe('SupportMessageController', () => {
  let controller: SupportMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // controllers: HTTP 통신 역할
      controllers: [SupportMessageController],
    }).compile();

    controller = module.get<SupportMessageController>(SupportMessageController); // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
