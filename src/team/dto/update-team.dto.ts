import { IsNotEmpty, IsString } from 'class-validator'; // 유효성 검사

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty({ message: '팀 이름을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '팀에 대한 소개를 입력해주세요.' })
  description: string;
}
