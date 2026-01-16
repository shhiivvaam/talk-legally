import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { Session } from '@shared/database/entities/session.entity';
import { LawyerEarning } from '@shared/database/entities/lawyer-earning.entity';
import { AvailabilityStatus, VerificationStatus } from '@shared/types';
import { UpdateProfileDto, UpdatePricingDto } from './dto/lawyer.dto';

@Injectable()
export class LawyerService {
  constructor(
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(LawyerEarning)
    private earningRepository: Repository<LawyerEarning>,
  ) { }

  async getProfile(lawyerId: string) {
    const lawyer = await this.lawyerRepository.findOne({
      where: { id: lawyerId },
      select: [
        'id', 'email', 'phone', 'name', 'profileImageUrl', 'bio', 'experienceYears',
        'specialization', 'languages', 'locationLatitude', 'locationLongitude',
        'verificationStatus', 'chatPricePerMin', 'voicePricePerMin', 'videoPricePerMin',
        'availabilityStatus', 'ratingAvg', 'totalRatings', 'totalEarnings', 'isActive',
      ],
    });

    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    return lawyer;
  }

  async updateProfile(lawyerId: string, updateProfileDto: UpdateProfileDto) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    Object.assign(lawyer, updateProfileDto);
    return this.lawyerRepository.save(lawyer);
  }

  async uploadDocuments(lawyerId: string, barCouncilDocUrl: string, govtIdDocUrl: string) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    lawyer.barCouncilDocUrl = barCouncilDocUrl;
    lawyer.govtIdDocUrl = govtIdDocUrl;
    lawyer.verificationStatus = VerificationStatus.PENDING as VerificationStatus; // Reset to pending for re-verification

    return this.lawyerRepository.save(lawyer);
  }

  async updatePricing(lawyerId: string, updatePricingDto: UpdatePricingDto) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    if (updatePricingDto.chatPricePerMin !== undefined) {
      lawyer.chatPricePerMin = updatePricingDto.chatPricePerMin;
    }
    if (updatePricingDto.voicePricePerMin !== undefined) {
      lawyer.voicePricePerMin = updatePricingDto.voicePricePerMin;
    }
    if (updatePricingDto.videoPricePerMin !== undefined) {
      lawyer.videoPricePerMin = updatePricingDto.videoPricePerMin;
    }

    return this.lawyerRepository.save(lawyer);
  }

  async updateAvailability(lawyerId: string, availabilityStatus: AvailabilityStatus) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    lawyer.availabilityStatus = availabilityStatus;
    return this.lawyerRepository.save(lawyer);
  }

  async getEarnings(lawyerId: string, startDate?: string, endDate?: string) {
    const query = this.earningRepository
      .createQueryBuilder('earning')
      .where('earning.lawyerId = :lawyerId', { lawyerId });

    if (startDate && endDate) {
      query.andWhere('earning.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const earnings = await query
      .orderBy('earning.createdAt', 'DESC')
      .getMany();

    const totalEarnings = earnings.reduce((sum, e) => sum + parseFloat(e.netEarnings.toString()), 0);
    const totalCommission = earnings.reduce((sum, e) => sum + parseFloat(e.commissionDeducted.toString()), 0);

    return {
      earnings,
      totalEarnings,
      totalCommission,
      count: earnings.length,
    };
  }

  async getSessions(lawyerId: string, limit: number, offset: number) {
    const [sessions, total] = await this.sessionRepository.findAndCount({
      where: { lawyerId },
      relations: ['user'],
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

  async requestWithdrawal(lawyerId: string, amount: number, bankDetails: any) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    const availableEarnings = parseFloat(lawyer.totalEarnings.toString());
    if (amount > availableEarnings) {
      throw new BadRequestException('Insufficient earnings');
    }

    // In production, this would create a withdrawal request record
    // and process it via payment gateway
    return {
      success: true,
      message: 'Withdrawal request submitted',
      amount,
    };
  }
}
