import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Team } from '../../team/entities/team.entity'; // team 엔티티 사용
import { User } from '../../user/entities/user.entity'; // user 엔티티 사용

@Entity({
  name: 'support_messages', // 테이블 명
})
export class SupportMessage {
  @PrimaryGeneratedColumn() // 기본키 설정
  id: number;

  @Column()
  message: string;

  // 다대일 관계 설정
  // (user) => user.supportMessages : user 엔티티 내에서 'supportMessage'를 필드로 supportMessage 엔티티에 접근 가능
  @ManyToOne(() => User, (user) => user.supportMessages)
  // @JoinColumn : 외래키 설정, 사용 안하면(ex) 기본 규칙에 따라 외래키 필드를 자동으로 생성한다함
  @JoinColumn({ name: 'user_id' })
  user: User; // 관계 테이블
  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number; // 외래키

  // 다대일 관계 설정
  // (team) => team.supportMessages : team 엔티티 내에서 'supportMessage'를 필드로 supportMessage 엔티티에 접근 가능
  @ManyToOne(() => Team, (team) => team.supportMessages, {
    onDelete: 'CASCADE', // Team이 삭제될 경우 관련 데이터 삭제
  })
  team: Team; // 관계 테이블
  @Column({ type: 'bigint', name: 'team_id' })
  team_id: number; // 외래키
}
