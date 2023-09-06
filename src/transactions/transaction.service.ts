import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import axios from 'axios';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async fetchTransactions() {
    const blockNumber = await this.getCurrentBlockNumber();
    const targetBlockNumber = 17583000;

    if (blockNumber < targetBlockNumber) {
      console.log(
        `Block number ${blockNumber} is less than ${targetBlockNumber}. Skipping data retrieval.`,
      );
      return;
    }

    // Add a delay so Etherscan allows next request
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const transactions = await this.getTransactionsInBlock(blockNumber);

    await this.saveTransactionsToDatabase(transactions);
  }

  async getCurrentBlockNumber(): Promise<number> {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_blockNumber',
      },
    });

    const blockNumberHex = response.data.result;
    return parseInt(blockNumberHex, 16);
  }

  async getTransactionsInBlock(blockNumber: number) {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_getBlockByNumber',
        tag: `0x${blockNumber.toString(16)}`,
        boolean: 'true',
      },
    });
    const blockData = response.data.result;
    return blockData.transactions;
  }

  async saveTransactionsToDatabase(transactions: any[]) {
    for (const txData of transactions) {
      const transaction = this.transactionRepository.create({
        from: txData.from,
        to: txData.to,
        value: parseInt(txData.value, 16),
      });
      await this.transactionRepository.save(transaction);
    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    return this.transactionRepository.createTransaction(createTransactionDto);
  }

  async getAllTransactions() {
    await this.fetchTransactions();
    return this.transactionRepository.find();
  }
}
