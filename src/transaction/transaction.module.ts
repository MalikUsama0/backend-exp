import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from 'src/entities/Transaction.entity';
import { UserModule } from 'src/user/user.module';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UserModule,
    UserBalanceModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TypeOrmModule],
})
export class TransactionModule {}
