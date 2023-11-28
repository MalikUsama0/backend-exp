import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { TransactionDto } from './DTO/Transaction.dto';
import { UserService } from 'src/user/user.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
@Injectable()
export class TransactionService {
  constructor(
    private userBalanceService: UserBalanceService,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}
  findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  findOne(id: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOneBy({ id });
  }

  async createTransaction(body: TransactionDto): Promise<Transaction> {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const data = await this.userBalanceService.findOne(
      body.userId,
      currentMonth,
      currentYear,
    );

    console.log(data, 'userData');
    if (data) {
      await this.userBalanceService.updatePaidAmount(
        data.id,
        Number(data.total_paid) + Number(body.amount),
        Number(data.pending_amount) - Number(body.amount),
      );
    } else {
      let previousMonth, previousYear;
      if (currentMonth === 1) {
        // If the current month is January, set the previous month to December and decrement the year
        previousMonth = 12;
        previousYear = currentYear - 1;
      } else {
        // Otherwise, just decrement the current month to get the previous month
        previousMonth = currentMonth - 1;
        previousYear = currentYear;
      }
      const data = await this.userBalanceService.findOne(
        body.userId,
        previousMonth,
        previousYear,
      );
      console.log(data, 'previous  month data');
      const userBalanceData = {
        userId: data.userId,
        total_expenses: 0,
        total_paid: Number(body.amount),
        pending_amount: Number(data.pending_amount) - Number(body.amount),
        previous_pending: Number(data.pending_amount),
      };
      this.userBalanceService.create(userBalanceData);
    }

    return this.transactionsRepository.save(body);
  }

  async remove(id: number): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
