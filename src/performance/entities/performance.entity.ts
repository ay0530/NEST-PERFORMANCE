import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'PREFORMANCE', // 테이블 명
})
export class Performance {
  @PrimaryGeneratedColumn() // 기본키 설정
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  prfrm_id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', select: false })
  genre: string;

  @Column({ type: 'varchar', select: true, nullable: false })
  state: string;

  @Column({ type: 'varchar', select: true, nullable: false })
  area: string;

  @Column({ type: 'varchar', select: true, nullable: false })
  theater: string;

  @Column({ type: 'varchar', select: true })
  poster: string;

  @Column({ type: 'date', select: true, nullable: false })
  start_date: Date;

  @Column({ type: 'date', select: true, nullable: false })
  end_date: Date;

  // 일대다 관계 설정
  // (supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'user' 필드를 참고
  // @OneToMany(() => SupportMessage, (supportMessage) => supportMessage.user)
  // supportMessages: SupportMessage[];
}
