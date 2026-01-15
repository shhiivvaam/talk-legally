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

@Entity('favorites')
@Unique(['userId', 'lawyerId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'lawyer_id' })
  lawyerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.favorites)
  @JoinColumn({ name: 'lawyer_id' })
  lawyer: Lawyer;
}
