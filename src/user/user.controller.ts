import { UserInfo } from '../utils/userInfo.decorator'; // UserInfo 데코레이터 사용

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'; // 유효성 검사 파이프
import { AuthGuard } from '@nestjs/passport'; // 특정 경로 접근 제한 가드

import { LoginDto } from './dto/login.dto'; // login dto 사용
import { User } from './entities/user.entity'; // user 엔티티 사용
import { UserService } from './user.service'; // user 서비스 사용

@Controller('user') // 라우터 경로
export class UserController {
  constructor(private readonly userService: UserService) {} // 매개변수만 설정하고 본문은 비어있음!!

  @Post('register')
  // `@Body() loginDto: LoginDto` : body 값을 loginDto로 매핑
  async register(@Body() loginDto: LoginDto) {
    return await this.userService.register(loginDto.email, loginDto.password);
  }

  @Post('login')
  // `@Body() loginDto: LoginDto` : body 값을 loginDto로 매핑
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt')) // JWT 토큰이 유효한지 검사하는 가드
  @Get('email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email };
  }
}
