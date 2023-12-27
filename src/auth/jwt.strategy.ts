import _ from 'lodash'; // 다양한 데이터 처리 함수 제공
import { ExtractJwt, Strategy } from 'passport-jwt'; // jwt 사용
import { UserService } from 'src/user/user.service'; // user 서비스 사용

import { Injectable, NotFoundException } from '@nestjs/common'; // 유효성 검사 파이프
import { ConfigService } from '@nestjs/config'; // 환경 변수 및 구성 관리
import { PassportStrategy } from '@nestjs/passport'; // 특정 경로 접근 제한 가드

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    // ConfigService : 환경 변수 값 조회
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
