import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOSTNAME || 'localhost',
      port: Number.parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'postgres',
      entities: ['dist/**/*.entity.{js,ts}'],
      migrations: ['dist/migrations/**/*.{ts,js}'],
      migrationsTableName: 'custom_migration_table',
      synchronize: true,
    }),
    TransactionsModule,
    BalanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
