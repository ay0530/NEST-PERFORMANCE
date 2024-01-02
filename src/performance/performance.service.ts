import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as xml2js from 'xml2js';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import _ from 'lodash';

interface PerformanceJSON {
  dbs: {
    db: {
      mt20id: string[];
      prfnm: string[];
      prfpdfrom: Date[];
      prfpdto: Date[];
      fcltynm: string[];
      poster: string[];
      genrenm: string[];
      openrun: string[];
      prfstate: string[];
      area: string[];
    }[];
  };
}

@Injectable()
export class PerformanceService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
  ) {}

  // 공연 정보 저장
  async create(): Promise<void> {
    try {
      // API 실행 시간이 정말 김. 10초 이상 소요
      // 어떤 공연 정보들을 저장할 것인지 정해야함
      // 저장된 공연 정보들이 변경될 경우 수정을 어떻게 할 것인지 고민 필요
      const response = await this.httpService
        .get('http://www.kopis.or.kr/openApi/restful/pblprfr', {
          params: {
            service: 'fc75c2b32e4c4e04b57ed1fd03c3bf83', // 서비스키(필수)
            stdate: '20230601', // 공연 시작일
            eddate: '20231230', // 공연 종료일
            cpage: 1, // 페이지 번호(필수)
            rows: 200, // 공연 개수(필수)
            shcate: 'AAAA|GGGA', // 장르 번호 (AAAA : 공연, GGGA : 뮤지컬)
          },
        })
        .toPromise();

      const xmlData = response.data;

      // XML 데이터를 JSON 형식으로 변환
      const jsonData: PerformanceJSON = await new Promise((resolve, reject) => {
        new xml2js.Parser().parseString(xmlData, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      // 필요한 데이터 추출
      const performances = jsonData.dbs.db.map((item) => {
        return {
          prfrm_id: item.mt20id[0],
          name: item.prfnm[0],
          theater: item.fcltynm[0],
          start_date: item.prfpdfrom[0],
          end_date: item.prfpdto[0],
          poster: item.poster[0],
          genre: item.genrenm[0],
          state: item.prfstate[0],
          // area: item.area[0], area가 없어졌다 ?
        };
      });
      console.log('performances: ', performances);

      // 공연 정보 저장
      for (const performance of performances) {
        await this.performanceRepository.save(performance);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 공연 정보 수정

  // 공연 전체 정보 조회
  async findAll(): Promise<Performance[]> {
    return await this.performanceRepository.find({});
  }

  // 공연 전체 정보 검색
  async search(value: any): Promise<Performance[]> {
    // 공연명, 극장명 검색
    return await this.performanceRepository.find({
      where: [{ name: ILike(`%${value}%`) }, { theater: ILike(`%${value}%`) }],
    });
  }

  // 공연 상세 정보 조회
  async findOne(id: number) {
    // 회원 정보 조회
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    // ERR : 공연 id가 존재하지 않을 경우
    if (_.isNil(performance)) {
      throw new NotFoundException('공연이 존재하지 않습니다.');
    }

    return performance;
  }
  // 공연 삭제
}
