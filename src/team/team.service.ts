import _ from 'lodash'; // 다양한 데이터 처리 함수 제공
import { parse } from 'papaparse'; // csv 파일 읽고 파싱
import { Repository } from 'typeorm'; // typeorm의 캡슐화된 레포지토리 클래스 조회

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; // 유효성 검사 파이프
import { InjectRepository } from '@nestjs/typeorm'; // typeorm 연결

import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity'; // team 엔티티 사용

@Injectable() // nest.js가 제공하는 데코레이터, 클래스를 DI 시스템에 등록(다른 컴포넌트에서 사용 가능)
export class TeamService {
  constructor(
    // @InjectRepository : 레포지토리를 주입하는 데코레이터
    @InjectRepository(Team) // TypeORM의 레포지토리 패턴을 사용하여 Team 엔티티에 대한 DB 작업 수행
    private readonly teamRepository: Repository<Team>, // Repository<Team> : 레포지토리가 Team 타입의 객체로 작업하도록 지정(<> : 제네릭)
  ) {} // 매개변수만 설정하고 본문은 비어있음!!

  // 팀 전체 조회
  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      select: ['id', 'name'],
    });
  }

  // 팀 Id 조회
  async findOne(id: number) {
    return await this.verifyTeamById(id);
  }

  // 팀 정보 생성
  // Express.Multer.File : Multer 미들웨어에 의해 업로드된 파일 정보
  async create(file: Express.Multer.File) {
    // endWith() :
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV 파일만 업로드 가능합니다.');
    }

    // 파일의 buffer(내용)을 문자열로 변환
    const csvContent = file.buffer.toString();

    let parseResult;
    try {
      // parse : 파일 파싱
      parseResult = parse(csvContent, {
        header: true, // csv 파일의 헤더를 필드명으로 설정
        skipEmptyLines: true, // 빈 줄은 무시
      });
    } catch (error) {
      throw new BadRequestException('CSV 파싱에 실패했습니다.');
    }

    const teamsData = parseResult.data as any[]; // 파싱된 값을 any 타입으로 teamsData에 할당

    for (const teamData of teamsData) {
      if (_.isNil(teamData.name) || _.isNil(teamData.description)) {
        throw new BadRequestException(
          'CSV 파일은 name과 description 컬럼을 포함해야 합니다.',
        );
      }
    }

    // 파싱된 값을 createTeamDtos에 매핑(DB 저장을 위해)
    const createTeamDtos = teamsData.map((teamData) => ({
      name: teamData.name,
      description: teamData.description,
    }));

    // 팀 정보 저장
    await this.teamRepository.save(createTeamDtos);
  }

  // 팀 정보 수정
  async update(id: number, updateTeamDto: UpdateTeamDto) {
    await this.verifyTeamById(id);
    await this.teamRepository.update({ id }, updateTeamDto);
  }

  // 팀 정보 삭제
  async delete(id: number) {
    await this.verifyTeamById(id);
    await this.teamRepository.delete({ id });
  }

  // 팀 정보 조회
  private async verifyTeamById(id: number) {
    const team = await this.teamRepository.findOneBy({ id });
    if (_.isNil(team)) {
      throw new NotFoundException('존재하지 않는 팀입니다.');
    }

    return team;
  }
}
