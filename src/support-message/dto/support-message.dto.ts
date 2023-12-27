import { IsNotEmpty, IsString } from 'class-validator'; // 유효성 검사

export class SupportMessageDto {
  @IsString()
  @IsNotEmpty({ message: '응원 메시지를 입력해주세요.' })
  message: string;
}
