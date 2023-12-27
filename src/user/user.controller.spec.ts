import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller'; // user 컨트롤러 사용

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // controllers: HTTP 통신 역할
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController); // <>타입의 인스턴스를 반환하기.. (제너릭 안에는 아무거나 넣을 수 있음..)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
