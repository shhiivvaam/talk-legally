import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './session.entity';
import { LawyerEarning } from './lawyer-earning.entity';
import { Review } from './review.entity';
import { Favorite } from './favorite.entity';
import { VerificationStatus, AvailabilityStatus } from '../../types';

@Entity('lawyers')
export class Lawyer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ name: 'experience_years', default: 0 })
  experienceYears: number;

  @Column('text', { array: true, default: [] })
  specialization: string[];

  @Column('text', { array: true, default: [] })
  languages: string[];

  @Column({ name: 'location_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  locationLatitude: number;

  @Column({ name: 'location_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  locationLongitude: number;

  @Column({ name: 'bar_council_id', nullable: true })
  barCouncilId: string;

  @Column({ name: 'bar_council_doc_url', nullable: true })
  barCouncilDocUrl: string;

  @Column({ name: 'govt_id_doc_url', nullable: true })
  govtIdDocUrl: string;

  @Column({ name: 'verification_status', type: 'varchar', default: VerificationStatus.PENDING })
  verificationStatus: VerificationStatus;

  @Column({ name: 'chat_price_per_min', type: 'decimal', precision: 10, scale: 2, default: 0 })
  chatPricePerMin: number;

  @Column({ name: 'voice_price_per_min', type: 'decimal', precision: 10, scale: 2, default: 0 })
  voicePricePerMin: number;

  @Column({ name: 'video_price_per_min', type: 'decimal', precision: 10, scale: 2, default: 0 })
  videoPricePerMin: number;

  @Column({ name: 'availability_status', type: 'varchar', default: AvailabilityStatus.OFFLINE })
  availabilityStatus: AvailabilityStatus;

  @Column({ name: 'working_hours', type: 'jsonb', default: {} })
  workingHours: Record<string, any>;

  @Column({ name: 'total_earnings', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAvg: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings: number;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.lawyer)
  sessions: Session[];

  @OneToMany(() => LawyerEarning, (earning) => earning.lawyer)
  earnings: LawyerEarning[];

  @OneToMany(() => Review, (review) => review.lawyer)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.lawyer)
  favorites: Favorite[];
}
