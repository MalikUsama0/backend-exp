import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository, getConnection } from 'typeorm';
import { ActivateUserDto } from './DTO/activate-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { User } from 'src/entities/User.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { isArray } from 'class-validator';
import { UsersList } from 'src/interfaces/user.type';
import { promises } from 'dns';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return await this.getUserById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findUser(email: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ email });
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsers(
    options: FindManyOptions<User>,
    count: number,
    textSearch: string | undefined,
  ): Promise<{ totalUsers: User[]; count: number }> {
    const totalUsers = await this.userRepository.find(options);
    if (textSearch == '' || textSearch == undefined) {
      count = await this.userRepository.count();
    } else {
      count = await this.userRepository.count({
        where: [
          { name: Like(`%${textSearch}%`) },
          { email: Like(`%${textSearch}%`) },
        ],
      });
    }

    // console.log(users, '----usersdkfkddsklfjkldsjfkdsljfkld');
    return { totalUsers, count };
  }
  async getOneUser(userId: number) {
    let total = 0;
    const data = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['user_expense'],
      select: {
        id: true,
        name: true,
      },
    });
    if (!data) {
      throw new NotFoundException(`no user against this ${userId}`);
    }
    // return data;
    if (isArray(data.user_expense)) {
      if (data.user_expense.length == 0) {
        total = 0;
      } else {
        total = data.user_expense.reduce((sum, expense) => {
          return sum + parseFloat(expense.shared_expense);
        }, 0);
      }
    }
    delete data.user_expense;
    data['totalExpense'] = total;
    return { ...data };
  }
  async getAllUsersExpense(options: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }
  filterData = (data) => {
    return data.map((user) => {
      if (isArray(user.user_balance) && isArray(user.user_balance)) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,

          phone: user.phone,
          active: user.active,
          created_at: user.created_at,
          updated_at: user.updated_at,
          totalExpenses: user?.user_balance[0]?.total_expenses
            ? user?.user_balance[0].total_expenses
            : 0,
          total_paid: user.user_balance[0]?.total_paid
            ? user.user_balance[0].total_paid
            : 0,
          pending_amount: user.user_balance[0]?.pending_amount
            ? user.user_balance[0].pending_amount
            : 0,
          previous_pending: user.user_balance[0]?.previous_pending
            ? user.user_balance[0].previous_pending
            : 0,
        };
      }
    });
  };
  // getUserWithExpenseBalance = (data) => {
  //   return data.map((user) => {
  //     if (isArray(user.user_expense) && isArray(user.user_transaction)) {
  //       const totalExpense = user.user_expense.reduce((sum, expense) => {
  //         return sum + parseFloat(expense.shared_expense);
  //       }, 0);

  //       const totalAmount = user.user_transaction.reduce((sum, transaction) => {
  //         return sum + parseFloat(transaction.amount);
  //       }, 0);

  //       return {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         phone: user.phone,
  //         active: user.active,
  //         created_at: user.created_at,
  //         updated_at: user.updated_at,
  //         totalExpense: totalExpense.toFixed(1),
  //         // balance: totalBa lanace,
  //         paid: totalAmount,
  //         pending: (totalExpense - totalAmount).toFixed(1),
  //         // Assuming you want to round to 2 decimal places
  //       };
  //     }
  //   });
  // };

  async findAll(
    firstDay: string,
    lastDay: string,
    count: string | number,
    limit: string,
    offset: string,
    previousFirstDay: string,
    previousLastDay: string,
  ): Promise<any> {
    if (count == 0) {
      count = await this.userRepository.count({ where: { active: true } });
    }
    const qb = this.userRepository.createQueryBuilder('user');
    // qb.leftJoinAndSelect(
    //   'user.user_expense',
    //   'user_expense',
    //   'user_expense.created_at BETWEEN :firstDay AND :lastDay',
    // );
    // qb.orWhere('user_expense.created_at IS NULL');
    // qb.orWhere('user_expense.created_at IS NOt NULL');

    // qb.setParameter('firstDay', firstDay);
    // qb.setParameter('lastDay', lastDay);
    // qb.where('user.active = :isActive', { isActive: true });
    // qb.leftJoinAndSelect(
    //   'user.user_transaction',
    //   'user_transaction',
    //   'user_transaction.created_at BETWEEN :firstDay AND :lastDay',
    // );
    // qb.orWhere('user_transaction.created_at IS NULL');
    // qb.orWhere('user_transaction.created_at IS NOt NULL');
    // qb.take(+limit); // Set the limit
    // qb.skip(+offset);
    // qb.orderBy('user.created_at', 'ASC');

    qb.leftJoinAndSelect(
      'user.user_balance',
      'user_balance',
      'user_balance.createdAt BETWEEN :firstDay AND :lastDay',
    );
    qb.orWhere('user_balance.createdAt IS NULL');
    qb.orWhere('user_balance.createdAt IS NOt NULL');
    qb.setParameter('firstDay', firstDay);
    qb.setParameter('lastDay', lastDay);
    qb.where('user.active = :isActive', { isActive: true });

    qb.take(+limit); // Set the limit
    qb.skip(+offset);
    qb.orderBy('user.created_at', 'ASC');
    const data = await qb.getMany();
    const totalUsers = this.filterData(data);
    // const totalUsers = this.getUserWithExpenseBalance(data);

    return { totalUsers, count };
  }

  findUsers(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  async updateUserStatus(userId: number, body: ActivateUserDto): Promise<User> {
    const user = await this.getUserById(userId);
    user.active = body.active;
    const updateStudent = await this.userRepository.save(user);
    console.log(updateStudent, 'update in backend');
    return updateStudent;
  }

  async addUserwithSP(): Promise<any> {
    return this.userRepository.query('CALL add_user()');
  }
}
