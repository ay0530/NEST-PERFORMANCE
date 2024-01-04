import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'; // 유효성 검사 파이프
import { AuthGuard } from '@nestjs/passport'; // 특정 경로 접근 제한 가드

import { ReservationService } from './reservation.service'; // user 서비스 사용
import { User } from 'src/user/entities/user.entity'; // user 엔티티 사용
import { UserInfo } from 'src/utils/userInfo.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {} // 매개변수만 설정하고 본문은 비어있음!!

  @UseGuards(AuthGuard('jwt')) // JWT 토큰이 유효한지 검사하는 가드
  @Post(':prfrm_id')
  async createReservation(
    @UserInfo() user: User,
    @Param('prfrm_id') prfrm_id: number,
  ) {
    console.log('공연 예약 중 - 컨트롤러');
    return await this.reservationService.createReservation(user, prfrm_id);
  }

  @UseGuards(AuthGuard('jwt')) // JWT 토큰이 유효한지 검사하는 가드
  @Get(':rsvrt_id')
  async checkReservation(
    @UserInfo() user: User,
    @Param('rsvrt_id') rsvrt_id: number,
  ) {
    return await this.reservationService.checkReservation(user, rsvrt_id);
  }

  @UseGuards(AuthGuard('jwt')) // JWT 토큰이 유효한지 검사하는 가드
  @Delete(':rsvrt_id')
  async cancelReservation(
    @UserInfo() user: User,
    @Param('rsvrt_id') rsvrt_id: number,
  ) {
    return await this.reservationService.cancelReservation(user, rsvrt_id);
  }
}
