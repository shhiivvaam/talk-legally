import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Lawyer } from './lawyer.entity';
import { Session } from './session.entity';

@Entity('reviews')
@Unique(['userId', 'sessionId'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'lawyer_id' })
  lawyerId: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.reviews)
  @JoinColumn({ name: 'lawyer_id' })
  lawyer: Lawyer;

  @ManyToOne(() => Session, (session) => session.reviews)
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
