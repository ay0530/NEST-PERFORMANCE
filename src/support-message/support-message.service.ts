import _ from 'lodash'; // 다양한 데이터 처리 함수 제공
import { Repository } from 'typeorm'; // typeorm의 캡슐화된 레포지토리 클래스 조회

import { Injectable, NotFoundException } from '@nestjs/common'; // 유효성 검사 파이프
import { InjectRepository } from '@nestjs/typeorm'; // typeorm 연결

import { SupportMessage } from './entities/support-message.entity'; // support-message 엔티티 사용

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class SupportMessageService {
  constructor(
    // @InjectRepository : 레포지토리를 주입하는 데코레이터
    @InjectRepository(SupportMessage) // TypeORM의 레포지토리 패턴을 사용하여 SupportMessage 엔티티에 대한 DB 작업 수행
    private supportMessageRepository: Repository<SupportMessage>, // Repository<SupportMessage> : 레포지토리가 User 타입의 객체로 작업하도록 지정(<> : 제네릭)
  ) {} // 매개변수만 설정하고 본문은 비어있음!!

  // 응원 메시지 조회
  async getMessagesByTeamId(teamId: number) {
    return await this.supportMessageRepository.findBy({
      team_id: teamId,
    });
  }

  // 응원 메시지 저장
  async createMessage(teamId: number, userId: number, message: string) {
    await this.supportMessageRepository.save({
      team_id: teamId,
      user_id: userId,
      message,
    });
  }

  // 응원 메시지 수정
  async updateMessage(id: number, userId: number, message: string) {
    await this.verifyMessage(id, userId);
    await this.supportMessageRepository.update({ id }, { message });
  }

  // 응원 메시지 삭제
  async deleteMessage(id: number, userId: number) {
    await this.verifyMessage(id, userId);
    await this.supportMessageRepository.delete({ id });
  }

  // 사용자 권한 조회
  private async verifyMessage(id: number, userId: number) {
    const supportMessage = await this.supportMessageRepository.findOneBy({
      id,
    });

    if (_.isNil(supportMessage) || supportMessage.user_id !== userId) {
      throw new NotFoundException(
        '메시지를 찾을 수 없거나 수정/삭제할 권한이 없습니다.',
      );
    }
  }
}
