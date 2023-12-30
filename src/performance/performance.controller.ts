import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'; // 유효성 검사 파이프

import { PerformanceDto } from './dto/performance.dto'; // update-team dto 사용
import { PerformanceService } from './performance.service'; // team 서비스 사용
import { Performance } from './entities/performance.entity'; // user 엔티티 사용

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {} // 매개변수만 설정하고 본문은 비어있음!!

  // READ : 공연 전체 정보 조회
  @Get()
  async findAll() {
    // return await this.performanceService.findAll();
  }

  // READ : 공연 상세 조회
  @Get(':id')
  async findOne(@Param('id') id: number) {
    //   return await this.performanceService.findOne(id);
  }

  // CREATE : 공연 정보 저장
  @Post()
  async create() {
    await this.performanceService.create();
  }

  // UPDATE : 공연 정보 수정
  @Put(':id')
  // `@Body() loginDto: LoginDto` : body 값을 PerformanceDto로 매핑
  async update(
    @Param('id') id: number,
    @Body() PerformanceDto: PerformanceDto,
  ) {
    // await this.performanceService.update(id, PerformanceDto);
  }

  // DELETE : 공연 정보 삭제
  @Delete(':id')
  async delete(@Param('id') id: number) {
    // await this.performanceService.delete(id);
  }
}
