import _ from 'lodash'; // 다양한 데이터 처리 함수 제공
import { Repository } from 'typeorm'; // typeorm의 캡슐화된 레포지토리 클래스 조회

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'; // 유효성 검사 파이프
import { JwtService } from '@nestjs/jwt'; // jwt 사용
import { InjectRepository } from '@nestjs/typeorm'; // typeorm 연결

import { Reservation } from './entities/reservation.entity'; // reservation 엔티티 사용
import { User } from 'src/user/entities/user.entity';
import { Performance } from 'src/performance/entities/performance.entity';

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class ReservationService {
  constructor(
    // @InjectRepository : 레포지토리를 주입하는 데코레이터
    @InjectRepository(Reservation) // TypeORM의 레포지토리 패턴을 사용하여 Reservation 엔티티에 대한 DB 작업 수행
    private readonly reservationRepository: Repository<Reservation>, // Repository<Reservation> : 레포지토리가 Reservation 타입의 객체로 작업하도록 지정(<> : 제네릭)
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
  ) {} // 매개변수만 설정하고 본문은 비어있음!!

  // CREATE : 예약 정보 저장
  async createReservation(user: User, prfrm_id: number) {
    console.log('공연 예약 중');
    // 공연 번호 조회
    const existingPerformance = await this.performanceRepository.findOne({
      where: { id: prfrm_id },
    });

    // ERR : 이미 이메일이 존재할 경우
    if (_.isNil(existingPerformance)) {
      throw new ConflictException('공연 정보가 존재하지 않습니다.');
    }

    // 예약 정보 저장
    await this.reservationRepository.save({
      user_id: user.id,
      prfrm_id,
      rsvrt_date: new Date(),
    });
  }

  // // READ : 예약 정보 조회
  async checkReservation(user: User, rsvrt_id: number) {
    // 예약 정보 조회
    const reservation = await this.reservationRepository.findOne({
      where: { id: rsvrt_id },
    });

    // ERR : 예약 정보가 없을 경우
    if (_.isNil(reservation)) {
      throw new UnauthorizedException('예약이 존재하지 않습니다.');
    }

    return reservation;
  }

  // READ : 예약 정보 취소
  async cancelReservation(user: User, rsvrt_id: number) {
    // 예약 정보 조회
    const reservation = await this.reservationRepository.findOne({
      where: { id: rsvrt_id },
    });

    // ERR : 예약 정보가 없을 경우
    if (_.isNil(reservation)) {
      throw new UnauthorizedException('예약이 존재하지 않습니다.');
    }

    // 예약 정보 삭제
    await this.reservationRepository.delete({ id: rsvrt_id });
  }
}
