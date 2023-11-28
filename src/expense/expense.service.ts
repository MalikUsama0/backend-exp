import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/entities/Expense.entity';
import { User } from 'src/entities/User.entity';
import {
  FindManyOptions,
  Repository,
  Between,
  In,
  DeleteResult,
  FindOptionsWhere,
} from 'typeorm';
import {
  CreateExpenseDto,
  CreateType,
  ExpenseDto,
  UpdateExpenseDto,
} from './expense.dto';
import { UserExpense } from 'src/entities/UserExpense.entity';
import { UserService } from 'src/user/user.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
import { isArray } from 'class-validator';
@Injectable()
export class ExpenseService {
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  previousMonth;
  previousYear;
  constructor(
    private userBalanceService: UserBalanceService,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(UserExpense)
    private userExpenseRepository: Repository<UserExpense>,
    private readonly userService: UserService,
  ) {
    if (this.currentMonth === 1) {
      // If the current month is January, set the previous month to December and decrement the year
      this.previousMonth = 12;
      this.previousYear = this.currentYear - 1;
    } else {
      // Otherwise, just decrement the current month to get the previous month
      this.previousMonth = this.currentMonth - 1;
      this.previousYear = this.currentYear;
    }
  }

  async findAll(
    options: FindManyOptions<Expense>,
    count: number,
    firstDay: string,
    lastDay: string,
  ): Promise<{ expenseData: CreateExpenseDto[]; count: any }> {
    if (count == 0) {
      count = await this.expenseRepository.count({
        where: {
          createdAt: Between(new Date(firstDay), new Date(lastDay)),
        },
      });
    }
    const data = await this.expenseRepository.find(options);
    const expenseData = data.map((exp) => {
      return {
        id: exp.id,
        title: exp.title,
        amount: exp.amount,
        description: exp.description,
        created_at: exp.createdAt,
        updated_at: exp.updatedAt,
        due_date: exp.due_date,
        type: exp.type,
        user: exp.user,
        userIds:
          isArray(exp.user_expense) &&
          exp.user_expense.map((ele) => ele.user.id.toString()),
      };
    });
    return { expenseData, count };
  }

  findOne(id: number): any {
    return this.expenseRepository.find({
      where: { user: { id } },
      relations: ['edit_by'],
    });
  }

  async findOneExpense(id: number): Promise<Expense | null> {
    const data = await this.expenseRepository.findOne({
      where: { id },
      relations: ['user_expense', 'user_expense.user'],
    });
    const expense = {
      ...data,
      userIds:
        isArray(data.user_expense) &&
        data.user_expense.map((ele) => ele.user.id.toString()),
    };
    delete expense.user_expense;
    return expense;
  }

  async createExpense(expenseData: CreateExpenseDto): Promise<Expense | null> {
    const type = expenseData.type;
    const selectedUsers = expenseData.userIds;
    delete expenseData.userIds;
    try {
      const newExpense = await this.saveExpense(expenseData);
      await this.divideExpense(newExpense, type, selectedUsers);
      return newExpense;
    } catch (error) {
      console.log('error===========', error);
      throw new InternalServerErrorException();
    }
  }

  async divideExpense(expense: Expense, type: CreateType, userIds: number[]) {
    console.log(expense, userIds, 'new expense save in expense');
    let users;
    if (type === CreateType.SELECTED && userIds.length > 0) {
      users = await this.userService.findUsers({
        where: { active: true, id: In(userIds) },
        select: {
          id: true,
        },
      });
    } else {
      users = await this.userService.findUsers({
        where: { active: true },
        select: {
          id: true,
        },
      });
    }
    const totalActiveUsers = users.length;
    const expenseShare = Number(expense.amount / totalActiveUsers).toFixed(1);
    console.log(users, 'userslist');
    // Create and save expense shares for each user
    const newExpense = { id: expense.id };

    for (let i = 0; i < totalActiveUsers; i++) {
      const data = await this.userBalanceService.findOne(
        users[i].id,
        this.currentMonth,
        this.currentYear,
      );
      if (data) {
        await this.userBalanceService.updateTotalExpenses(
          data.id,
          Number(data.total_expenses) + Number(expenseShare),
          Number(data.pending_amount) + Number(expenseShare),
        );
      } else {
        const userData = await this.userBalanceService.findOne(
          users[i].id,
          this.previousMonth,
          this.previousYear,
        );

        const userBalanceData = {
          userId: userData.userId,
          total_expenses: Number(expenseShare),
          total_paid: 0,
          pending_amount:
            Number(userData.pending_amount) + Number(expenseShare),
          previous_pending: Number(userData.pending_amount),
        };
        this.userBalanceService.create(userBalanceData);
      }

      const newUserExpense = await this.userExpenseRepository.create({
        user: users[i],
        expense: newExpense,
        shared_expense: Number(expenseShare),
      });
      await this.userExpenseRepository.save(newUserExpense);
    }
  }

  async saveExpense(expenseData: CreateExpenseDto): Promise<Expense | null> {
    const { title, amount, due_date, description, user_id, type } = expenseData;
    const user = new User();
    user.id = user_id;
    const expense = new Expense();
    expense.title = title;
    expense.amount = amount;
    expense.due_date = due_date;
    expense.description = description;
    expense.user = user;
    expense.type = type;
    return this.expenseRepository.save(expense);
  }
  getEqualIds = (updateIds, expenseIds) => {
    if (updateIds.length !== expenseIds.length) {
      return false;
    }

    const sortedArr1 = updateIds.map(Number).sort((a, b) => a - b);
    const sortedArr2 = expenseIds.map(Number).sort((a, b) => a - b);
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }
    return true;
  };
  async updateExpense(
    expenseData: Partial<UpdateExpenseDto>,
    expense: Partial<ExpenseDto>,
    id: string,
  ): Promise<Expense | null> {
    const expenseUpdate = new Expense();
    expenseUpdate.id = Number(id);
    console.log(
      '===========================================================================',
    );
    if (
      expenseData.amount == expense.amount &&
      expense.type == expenseData.type &&
      this.getEqualIds(expenseData.userIds, expense.userIds)
    ) {
      Object.assign(expense, expenseData);
      return this.expenseRepository.save(expense);
    } else {
      const previousExpense = (expense.amount / expense.userIds.length).toFixed(
        1,
      );

      const users = [...expense.userIds];
      let updatedUsers;
      if (expenseData.type == CreateType.ALL) {
        const data = await this.userService.findUsers({
          where: { active: true },
          select: {
            id: true,
          },
        });
        updatedUsers = data.map((ele) => ele.id);
      } else {
        updatedUsers = [...expenseData.userIds];
      }

      const currentExpense = Number(
        expenseData.amount / updatedUsers.length,
      ).toFixed(1);
      console.log(
        updatedUsers,
        users,
        previousExpense,
        currentExpense,
        'update users',
      );
      for (let i = 0; i < users.length; i++) {
        const data = await this.userBalanceService.findOne(
          users[i],
          this.currentMonth,
          this.currentYear,
        );
        console.log(data, 'data for update');
        if (data) {
          await this.userBalanceService.updateTotalExpenses(
            data.id,
            Number(data.total_expenses) - Number(previousExpense),
            Number(data.pending_amount) - Number(previousExpense),
          );
        }
      }
      const options: FindOptionsWhere<UserExpense> = {
        expense: { id: Number(id) },
      };
      this.deleteUserExpense(options);

      for (let i = 0; i < updatedUsers.length; i++) {
        const data = await this.userBalanceService.findOne(
          updatedUsers[i],
          this.currentMonth,
          this.currentYear,
        );

        if (data) {
          await this.userBalanceService.updateTotalExpenses(
            data.id,
            Number(data.total_expenses) + Number(currentExpense),
            Number(data.pending_amount) + Number(currentExpense),
          );
        } else {
          const userData = await this.userBalanceService.findOne(
            updatedUsers[i],
            this.previousMonth,
            this.previousYear,
          );
          if (!userData) {
            const obj = {
              userId: updatedUsers[i],
              total_expenses: Number(currentExpense),
              total_paid: 0,
              pending_amount: Number(currentExpense),
              previous_pending: 0,
            };
            this.userBalanceService.create(obj);
          } else {
            const userBalanceData = {
              userId: userData.userId,
              total_expenses: Number(currentExpense),
              total_paid: 0,
              pending_amount:
                Number(userData.pending_amount) + Number(currentExpense),
              previous_pending: Number(userData.pending_amount),
            };
            this.userBalanceService.create(userBalanceData);
          }
        }
        const user = new User();
        user.id = Number(updatedUsers[i]);
        console.log(
          updatedUsers[i],
          'dfkdfdkjshfkjdshfjkdshfjdskhfdjskhfdskjfhjdskfhdskjh',
        );
        const newUserExpense = await this.userExpenseRepository.create({
          user: user,
          expense: expenseUpdate,
          shared_expense: Number(currentExpense),
        });
        console.log(newUserExpense, 'new user expense');
        await this.userExpenseRepository.save(newUserExpense);
      }
    }

    Object.assign(expense, expenseData);
    return this.expenseRepository.save(expense);
    // Object.assign(expense, expenseData);
    // return this.expenseRepository.save(expense);
  }

  async deleteUserExpense(
    options: FindOptionsWhere<UserExpense>,
  ): Promise<DeleteResult> {
    return await this.userExpenseRepository.delete(options);
  }

  async remove(id: number): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
