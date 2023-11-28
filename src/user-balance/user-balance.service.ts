import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBalance } from 'src/entities/UserBalance.entity';
import { Repository } from 'typeorm';
import { AddUserBalanceDto } from './DTO/user-balance.dto';
@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(UserBalance)
    private readonly userBalanceRepository: Repository<UserBalance>,
  ) {}

  async create(body: AddUserBalanceDto): Promise<UserBalance> {
    return this.userBalanceRepository.save(body);
  }

  async findOne(
    id: number,
    currentMonth: number,
    currentYear: number,
  ): Promise<UserBalance> {
    const balance_user = this.userBalanceRepository
      // .findOne({
      //   where: { userId: id },
      //   select: {
      //     id: true,
      //     userId: true,
      //     total_expenses: true,
      //     total_paid: true,
      //     pending_amount: true,
      //   },
      // });

      .createQueryBuilder('user_balance')
      .where('user_balance.userId = :id', { id })
      .andWhere('EXTRACT(YEAR FROM user_balance.createdAt) = :currentYear', {
        currentYear,
      })
      .andWhere('EXTRACT(MONTH FROM user_balance.createdAt) = :currentMonth', {
        currentMonth,
      })
      .select([
        'user_balance.id',
        'user_balance.userId',
        'user_balance.total_expenses',
        'user_balance.total_paid',
        'user_balance.pending_amount',
        'user_balance.previous_pending',
      ])
      .getOne();

    if (!balance_user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return balance_user;
  }

  async updatePaidAmount(
    id: number,
    total_paid: number,
    pending_amount: number,
  ): Promise<any> {
    return this.userBalanceRepository.update(id, {
      total_paid,
      pending_amount,
    });
  }

  async updateTotalExpenses(
    id: number,
    total_expenses: number,
    pending_amount: number,
  ): Promise<any> {
    return this.userBalanceRepository.update(id, {
      total_expenses,
      pending_amount,
    });
  }

  // async createUserwithBalance(
  //   userId: number,
  //   total_expenses: number,
  //   total_paid: number,
  //   pending_amount: number,
  //   previous_pending: number,
  // ) {
  //   const userBalanceData = {
  //     userId: userId,
  //     total_expenses: total_expenses,
  //     total_paid: total_paid,
  //     pending_amount: pending_amount,
  //     previous_pending: previous_pending,
  //   };

  //   await this.userBalanceRepository.create(userBalanceData);
  // }
}
