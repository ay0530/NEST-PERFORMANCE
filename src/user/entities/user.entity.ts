// import { Performance } from 'src/performance/entities/performance.entity'; // performance 엔티티 사용
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../types/userRole.type'; // userRole 타입(enum) 사용

@Index('email', ['email'], { unique: true }) // index를 설정함으로써 검색 효율이 향상됨
@Entity({
  name: 'USER', // 테이블 명
})
export class User {
  @PrimaryGeneratedColumn() // 기본키 설정
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  // 일대다 관계 설정
  // (performance) => performance.user : performance 엔티티 내의 'user' 필드를 참고
  // @OneToMany(() => Performance, (performance) => performance.user)
  // performances: Performance[];
}
