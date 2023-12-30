import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as xml2js from 'xml2js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';

interface PerformanceData {
  mt20id: string[];
  prfnm: string[];
  prfpdfrom: string[];
  prfpdto: string[];
  fcltynm: string[];
  poster: string[];
  genrenm: string[];
  openrun: string[];
  prfstate: string[];
}

interface DB {
  db: PerformanceData[];
}

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
      const response = await this.httpService
        .get('http://www.kopis.or.kr/openApi/restful/pblprfr', {
          params: {
            service: 'fc75c2b32e4c4e04b57ed1fd03c3bf83',
            stdate: '20230601', // 공연 시작일
            eddate: '20231230', // 공연 종료일
            cpage: 1, // 페이지 번호
            rows: 200, // 공연 개수
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
          performance_id: item.mt20id[0],
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
}
