import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../transactions/transaction.repository';
import { Transaction } from '../transactions/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async findTopChangedAddress(): Promise<{
    address: string;
    balanceChange: number;
  }> {
    // Get uniq addresses from last 100 transactiions
    const addresses = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DISTINCT ON (transaction.id) transaction.from', 'address')
      .where('transaction.to IS NOT NULL')
      .addOrderBy('transaction.id', 'DESC')
      .limit(100)
      .getRawMany();

    let topAddress: string | null = null;
    let maxBalanceChange = 0;

    for (const { address } of addresses) {
      const balanceChange = await this.calculateBalanceChange(address);
      if (Math.abs(balanceChange) > Math.abs(maxBalanceChange)) {
        topAddress = address;
        maxBalanceChange = balanceChange;
      }
    }

    return {
      address: topAddress || 'No addresses found',
      balanceChange: maxBalanceChange,
    };
  }

  async calculateBalanceChange(address: string): Promise<number> {
    // Get last 100 transactions for this address
    const transactions: Transaction[] = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.from = :address OR transaction.to = :address', {
        address,
      })
      .orderBy('transaction.id', 'DESC')
      .limit(100)
      .getMany();

    let balanceChange = 0;

    for (const transaction of transactions) {
      if (transaction.from === address) {
        balanceChange -= transaction.value;
      } else if (transaction.to === address) {
        balanceChange += transaction.value;
      }
    }

    return balanceChange;
  }
}
