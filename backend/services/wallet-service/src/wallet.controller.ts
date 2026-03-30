import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { AddBalanceDto, DeductBalanceDto } from './dto/wallet.dto';

interface AuthenticatedRequest {
  user: { userId: string; email: string; role: string };
}

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get('balance')
  async getBalance(@Request() req: AuthenticatedRequest) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Get('transactions')
  async getTransactions(@Request() req: AuthenticatedRequest) {
    return this.transactionService.getUserTransactions(req.user.userId);
  }

  @Post('add')
  async addBalance(@Request() req: AuthenticatedRequest, @Body() addBalanceDto: AddBalanceDto) {
    return this.walletService.addBalance(req.user.userId, addBalanceDto.amount, addBalanceDto.referenceId);
  }

  @Post('deduct')
  async deductBalance(@Request() req: AuthenticatedRequest, @Body() deductBalanceDto: DeductBalanceDto) {
    return this.walletService.deductBalance(
      req.user.userId,
      deductBalanceDto.amount,
      deductBalanceDto.description,
      deductBalanceDto.sessionId,
    );
  }
}
