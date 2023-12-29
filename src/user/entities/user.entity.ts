// import { SupportMessage } from 'src/support-message/entities/support-message.entity'; // support-message 엔티티 사용
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

  @Column({ type: 'enum', enum: Role, default: Role.User }) // role 필드는 enum에서 설정한 값만 가질 수 있음
  role: Role;

  // 일대다 관계 설정
  // (supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'user' 필드를 참고
  // @OneToMany(() => SupportMessage, (supportMessage) => supportMessage.user)
  // supportMessages: SupportMessage[];
}
