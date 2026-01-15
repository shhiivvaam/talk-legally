import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lawyer } from './lawyer.entity';
import { Session } from './session.entity';

@Entity('lawyer_earnings')
export class LawyerEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lawyer_id' })
  lawyerId: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'commission_deducted', type: 'decimal', precision: 10, scale: 2, default: 0 })
  commissionDeducted: number;

  @Column({ name: 'net_earnings', type: 'decimal', precision: 10, scale: 2 })
  netEarnings: number;

  @Column({ name: 'payout_status', type: 'varchar', default: 'pending' })
  payoutStatus: string;

  @Column({ name: 'payout_date', nullable: true })
  payoutDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.earnings)
  @JoinColumn({ name: 'lawyer_id' })
  lawyer: Lawyer;

  @ManyToOne(() => Session, (session) => session.earnings)
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
