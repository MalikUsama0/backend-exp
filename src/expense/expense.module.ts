import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { Expense } from 'src/entities/Expense.entity';
import { UserExpense } from 'src/entities/UserExpense.entity';
import { UserModule } from 'src/user/user.module';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, UserExpense]),
    UserBalanceModule,
    UserModule,
  ],
  providers: [ExpenseService],
  controllers: [ExpenseController],
  exports: [TypeOrmModule],
})
export class ExpenseModule {}
