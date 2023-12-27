import { compare, hash } from 'bcrypt'; // 암호 해시화
import _ from 'lodash'; // 다양한 데이터 처리 함수 제공
import { Repository } from 'typeorm'; // typeorm의 캡슐화된 레포지토리 클래스 조회

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'; // 유효성 검사 파이프
import { JwtService } from '@nestjs/jwt'; // jwt 사용
import { InjectRepository } from '@nestjs/typeorm'; // typeorm 연결

import { User } from './entities/user.entity'; // user 엔티티 사용

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class UserService {
  constructor(
    // @InjectRepository : 레포지토리를 주입하는 데코레이터
    @InjectRepository(User) // TypeORM의 레포지토리 패턴을 사용하여 User 엔티티에 대한 DB 작업 수행
    private userRepository: Repository<User>, // Repository<User> : 레포지토리가 User 타입의 객체로 작업하도록 지정(<> : 제네릭)
    private readonly jwtService: JwtService,
  ) {} // 매개변수만 설정하고 본문은 비어있음!!

  // CREATE : 회원 정보 저장
  async register(email: string, password: string) {
    // 이메일 조회
    const existingUser = await this.findByEmail(email);

    // ERR : 이미 이메일이 존재할 경우
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await hash(password, 10);

    // 회원 정보 저장
    await this.userRepository.save({
      email,
      password: hashedPassword,
    });
  }

  // READ : 회원 정보 조회
  async login(email: string, password: string) {
    // 회원 정보 조회
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    // ERR : 이메일이 없을 경우
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    // ERR : 비밀번호가 없을 경우
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id }; // payload에서 id를 sub이란 이름으로 넣음
    return {
      access_token: this.jwtService.sign(payload), // jwtService.sign() : JWT 토큰 생성
    };
  }

  // READ : 이메일 조회
  async findByEmail(email: string) {
    // 이메일 조회
    return await this.userRepository.findOneBy({ email });
  }
}
