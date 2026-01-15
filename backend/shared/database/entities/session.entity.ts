import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Lawyer } from './lawyer.entity';
import { Transaction } from './transaction.entity';
import { LawyerEarning } from './lawyer-earning.entity';
import { Review } from './review.entity';
import { SessionType, SessionStatus } from '../../types';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'lawyer_id' })
  lawyerId: string;

  @Column({ name: 'session_type', type: 'varchar' })
  sessionType: SessionType;

  @Column({ type: 'varchar', default: SessionStatus.INITIATED })
  status: SessionStatus;

  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;

  @Column({ name: 'ended_at', nullable: true })
  endedAt: Date;

  @Column({ name: 'duration_seconds', default: 0 })
  durationSeconds: number;

  @Column({ name: 'total_cost', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCost: number;

  @Column({ name: 'platform_commission', type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformCommission: number;

  @Column({ name: 'lawyer_earnings', type: 'decimal', precision: 10, scale: 2, default: 0 })
  lawyerEarnings: number;

  @Column({ name: 'agora_channel_name', nullable: true })
  agoraChannelName: string;

  @Column({ name: 'agora_token', nullable: true, type: 'text' })
  agoraToken: string;

  @Column({ nullable: true, type: 'text' })
  summary: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.sessions)
  @JoinColumn({ name: 'lawyer_id' })
  lawyer: Lawyer;

  @OneToMany(() => Transaction, (transaction) => transaction.session)
  transactions: Transaction[];

  @OneToMany(() => LawyerEarning, (earning) => earning.session)
  earnings: LawyerEarning[];

  @OneToMany(() => Review, (review) => review.session)
  reviews: Review[];
}
