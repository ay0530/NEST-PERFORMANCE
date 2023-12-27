import { SupportMessage } from 'src/support-message/entities/support-message.entity'; // support-message 엔티티 사용
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'teams', // 테이블 명
})
export class Team {
  @PrimaryGeneratedColumn() // 기본키 설정
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  // 일대다 관계 설정
  // (supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'team' 필드를 참고
  @OneToMany(() => SupportMessage, (supportMessage) => supportMessage.team)
  supportMessages: SupportMessage[];
}
