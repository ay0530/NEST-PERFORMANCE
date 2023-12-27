import { User } from 'src/user/entities/user.entity'; // user 엔티티 사용

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'; // 유효성 검사 파이프
import { AuthGuard } from '@nestjs/passport'; // 특정 경로 접근 제한 가드

import { UserInfo } from '../utils/userInfo.decorator'; // UserInfo 데코레이터 사용
import { SupportMessageDto } from './dto/support-message.dto'; // supprot-message dto 사용
import { SupportMessageService } from './support-message.service'; // support-message 서비스 사용

@UseGuards(AuthGuard('jwt')) // JWT 토큰이 유효한지 검사하는 가드
@Controller('support-message') // 라우터 경로
export class SupportMessageController {
  constructor(private readonly supportMessageService: SupportMessageService) {} // 매개변수만 설정하고 본문은 비어있음!!

  // READ : 응원 메시지 조회
  @Get(':teamId')
  async getAllMessages(@Param('teamId') teamId: number) {
    return await this.supportMessageService.getMessagesByTeamId(teamId);
  }

  // CREATE : 응원 메시지 저장
  @Post(':teamId')
  async createMessage(
    @UserInfo() user: User,
    @Param('teamId') teamId: number,
    // `@Body() loginDto: LoginDto` : body 값을 SupportMessageDto로 매핑
    @Body() supportMessageDto: SupportMessageDto,
  ) {
    await this.supportMessageService.createMessage(
      teamId,
      user.id,
      supportMessageDto.message,
    );
  }

  // UPDATE : 응원 메시지 수정
  @Patch(':id')
  async updateMessage(
    @UserInfo() user: User,
    @Param('id') id: number,
    // `@Body() loginDto: LoginDto` : body 값을 SupportMessageDto로 매핑
    @Body() supportMessageDto: SupportMessageDto,
  ) {
    await this.supportMessageService.updateMessage(
      id,
      user.id,
      supportMessageDto.message,
    );
  }

  // DELETE : 응원 메시지 삭제
  @Delete(':id')
  async deleteMessage(@UserInfo() user: User, @Param('id') id: number) {
    await this.supportMessageService.deleteMessage(id, user.id);
  }
}
