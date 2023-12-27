import { IsEmail, IsNotEmpty, IsString } from 'class-validator'; // 유효성 검사

export class LoginDto {
  @IsEmail({}, { message: '이메일 형식을 올바르게 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
