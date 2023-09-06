import { DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async createTransaction({
    from,
    to,
    value,
  }: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.create({
      from,
      to,
      value,
    });

    await this.save(transaction);
    return transaction;
  }
}
