import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Session } from './session.entity';
import { TransactionType, PaymentGateway } from '../../types';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'transaction_type', type: 'varchar' })
  transactionType: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'balance_before', type: 'decimal', precision: 10, scale: 2 })
  balanceBefore: number;

  @Column({ name: 'balance_after', type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @Column({ name: 'payment_gateway', nullable: true, type: 'varchar' })
  paymentGateway: PaymentGateway;

  @Column({ name: 'payment_id', nullable: true })
  paymentId: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Session, { nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
