import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Point } from 'src/point/entites/point.entity';

@Entity('RESERVATION')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계 설정
  // (user) => user.supportMessages : user 엔티티 내에서 'supportMessage'를 필드로 supportMessage 엔티티에 접근 가능
  @ManyToOne(() => User, (user) => user.reservation)
  // @JoinColumn : 외래키 설정, 사용 안하면(ex) 기본 규칙에 따라 외래키 필드를 자동으로 생성한다함
  @JoinColumn({ name: 'user_id' })
  user: User; // 관계 테이블
  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number; // 외래키

  // 다대일 관계 설정
  // (user) => user.supportMessages : user 엔티티 내에서 'supportMessage'를 필드로 supportMessage 엔티티에 접근 가능
  @ManyToOne(() => Performance, (performance) => performance.reservation)
  // @JoinColumn : 외래키 설정, 사용 안하면(ex) 기본 규칙에 따라 외래키 필드를 자동으로 생성한다함
  @JoinColumn({ name: 'prfrm_id' })
  performance: Performance; // 관계 테이블
  @Column({ type: 'bigint', name: 'prfrm_id' })
  prfrm_id: number; // 외래키

  // 일대다 관계 설정
  // (supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'user' 필드를 참고
  @OneToMany(() => Point, (point) => point.user)
  point: Point[];

  @Column({ type: 'datetime' })
  rsvrt_date: Date;
}
