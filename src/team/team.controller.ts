import { Roles } from 'src/auth/roles.decorator'; // roles 데코레이터 사용
import { RolesGuard } from 'src/auth/roles.guard'; // roles 가드 사용
import { Role } from 'src/user/types/userRole.type'; // userRole 타입(enum) 사용

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'; // 유효성 검사 파이프
import { FileInterceptor } from '@nestjs/platform-express'; // 파일 업로드를 처리하는 인터셉터

import { UpdateTeamDto } from './dto/update-team.dto'; // update-team dto 사용
import { TeamService } from './team.service'; // team 서비스 사용

@UseGuards(RolesGuard)
@Controller('team') // 라우터 경로
export class TeamController {
  constructor(private readonly teamService: TeamService) {} // 매개변수만 설정하고 본문은 비어있음!!

  // READ : 팀 전체 정보 조회
  @Get()
  async findAll() {
    return await this.teamService.findAll();
  }

  // READ : 팀 상세 조회
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.teamService.findOne(id);
  }

  // CREATE : 팀 정보 저장
  @Roles(Role.Admin) // role이 Admin(1)일 경우에만 허용
  @Post()
  @UseInterceptors(FileInterceptor('file')) // 파일 업로드를 처리하는 인터셉터
  // Express.Multer.File : Multer 미들웨어에 의해 업로드된 파일 정보
  async create(@UploadedFile() file: Express.Multer.File) {
    await this.teamService.create(file);
  }

  // UPDATE : 팀 정보 수정
  @Roles(Role.Admin) // role이 Admin(1)일 경우에만 허용
  @Put(':id')
  // `@Body() loginDto: LoginDto` : body 값을 updateTeamDto로 매핑
  async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    await this.teamService.update(id, updateTeamDto);
  }

  // DELETE : 팀 정보 삭제
  @Roles(Role.Admin) // role이 Admin(1)일 경우에만 허용
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.teamService.delete(id);
  }
}
