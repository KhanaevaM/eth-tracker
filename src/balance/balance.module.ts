import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { TransactionRepository } from '../transactions/transaction.repository';

@Module({
  imports: [],
  providers: [BalanceService, TransactionRepository],
  controllers: [BalanceController],
})
export class BalanceModule {}
