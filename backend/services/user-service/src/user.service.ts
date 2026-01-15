import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { Session } from '@shared/database/entities/session.entity';
import { Favorite } from '@shared/database/entities/favorite.entity';
import { UpdateProfileDto, SearchLawyersDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'phone', 'name', 'profileImageUrl', 'locationLatitude', 'locationLongitude', 'address', 'walletBalance', 'isVerified'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);
    return this.userRepository.save(user);
  }

  async uploadDocument(userId: string, documentUrl: string, documentName: string) {
    // In production, this would save to S3 and create a record in user_documents table
    return {
      success: true,
      documentUrl,
      documentName,
    };
  }

  async searchLawyers(userId: string, searchDto: SearchLawyersDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const query = this.lawyerRepository.createQueryBuilder('lawyer')
      .where('lawyer.verificationStatus = :status', { status: 'approved' })
      .andWhere('lawyer.isActive = :active', { active: true });

    // Location-based search
    if (user.locationLatitude && user.locationLongitude && searchDto.radius) {
      const radiusKm = searchDto.radius || 10;
      query.andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(lawyer.location_latitude)) * cos(radians(lawyer.location_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(lawyer.location_latitude)))) <= :radius`,
        {
          lat: user.locationLatitude,
          lng: user.locationLongitude,
          radius: radiusKm,
        },
      );
    }

    // Specialization filter
    if (searchDto.specialization && searchDto.specialization.length > 0) {
      query.andWhere('lawyer.specialization && :specializations', {
        specializations: searchDto.specialization,
      });
    }

    // Language filter
    if (searchDto.language) {
      query.andWhere('lawyer.languages @> ARRAY[:language]', { language: searchDto.language });
    }

    // Price filter
    if (searchDto.maxPrice) {
      query.andWhere(
        '(lawyer.chat_price_per_min <= :maxPrice OR lawyer.voice_price_per_min <= :maxPrice OR lawyer.video_price_per_min <= :maxPrice)',
        { maxPrice: searchDto.maxPrice },
      );
    }

    // Availability filter
    if (searchDto.availability) {
      query.andWhere('lawyer.availability_status = :availability', {
        availability: searchDto.availability,
      });
    }

    // Rating filter
    if (searchDto.minRating) {
      query.andWhere('lawyer.rating_avg >= :minRating', { minRating: searchDto.minRating });
    }

    // Sort by distance if location provided
    if (user.locationLatitude && user.locationLongitude) {
      query.orderBy(
        `(6371 * acos(cos(radians(${user.locationLatitude})) * cos(radians(lawyer.location_latitude)) * cos(radians(lawyer.location_longitude) - radians(${user.locationLongitude})) + sin(radians(${user.locationLatitude})) * sin(radians(lawyer.location_latitude))))`,
        'ASC',
      );
    } else {
      query.orderBy('lawyer.rating_avg', 'DESC');
    }

    const [lawyers, total] = await query
      .take(searchDto.limit || 20)
      .skip(searchDto.offset || 0)
      .getManyAndCount();

    return {
      lawyers,
      total,
      limit: searchDto.limit || 20,
      offset: searchDto.offset || 0,
    };
  }

  async getLawyersMap(userId: string, lat: number, lng: number) {
    const lawyers = await this.lawyerRepository
      .createQueryBuilder('lawyer')
      .where('lawyer.verificationStatus = :status', { status: 'approved' })
      .andWhere('lawyer.isActive = :active', { active: true })
      .andWhere('lawyer.location_latitude IS NOT NULL')
      .andWhere('lawyer.location_longitude IS NOT NULL')
      .select([
        'lawyer.id',
        'lawyer.name',
        'lawyer.locationLatitude',
        'lawyer.locationLongitude',
        'lawyer.availabilityStatus',
        'lawyer.ratingAvg',
      ])
      .getMany();

    return lawyers.map((lawyer) => ({
      id: lawyer.id,
      name: lawyer.name,
      location: {
        latitude: parseFloat(lawyer.locationLatitude.toString()),
        longitude: parseFloat(lawyer.locationLongitude.toString()),
      },
      availability: lawyer.availabilityStatus,
      rating: parseFloat(lawyer.ratingAvg.toString()),
    }));
  }

  async addFavorite(userId: string, lawyerId: string) {
    const existing = await this.favoriteRepository.findOne({
      where: { userId, lawyerId },
    });

    if (existing) {
      return existing;
    }

    const favorite = this.favoriteRepository.create({ userId, lawyerId });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, lawyerId: string) {
    await this.favoriteRepository.delete({ userId, lawyerId });
    return { success: true };
  }

  async getSessions(userId: string, limit: number, offset: number) {
    const [sessions, total] = await this.sessionRepository.findAndCount({
      where: { userId },
      relations: ['lawyer'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      sessions,
      total,
      limit,
      offset,
    };
  }
}
