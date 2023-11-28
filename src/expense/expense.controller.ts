import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { queryData } from 'src/interfaces/expense.types';
import { CreateExpenseDto, UpdateExpenseDto } from './expense.dto';

import { Between } from 'typeorm';
import * as moment from 'moment';

@Controller('/expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}
  @Get()
  @UseGuards(AuthGuard, new PermissionsGuard('canView', 'expense'))
  getExpenseList(
    @Query() query: queryData,
  ): Promise<{ expenseData: CreateExpenseDto[]; count: number }> {
    const firstDay = moment(
      `${query.year}-${query.month}-01  `,
      'YYYY-MM-DD',
    ).format('YYYY-MM-DD HH:mm:ss.SSSSSS');
    const lastDay = moment(`${query.year}-${query.month}-01`, 'YYYY-MM-DD')
      .endOf('month')
      .format('YYYY-MM-DD HH:mm:ss.SSSSSS');
    const count = query.count;
    // const targetMonth = `${new Date().getFullYear()}-${query.month}`;
    return this.expenseService.findAll(
      {
        relations: ['user', 'user_expense.user'],
        where: {
          // Add your date filter here
          createdAt: Between(new Date(firstDay), new Date(lastDay)),
        },

        order: {
          createdAt: 'ASC',
        },
        take: query.limit,
        skip: query.offset,
      },
      count,
      firstDay,
      lastDay,
    );
  }

  @Post('/:id')
  findExpense(@Param('id') userId: number) {
    return this.expenseService.findOne(userId);
  }
  @Post()
  @UseGuards(AuthGuard, new PermissionsGuard('canCreate', 'expense'))
  async createExpense(@Body() expense: CreateExpenseDto) {
    return await this.expenseService.createExpense(expense);
  }
  // @Get('singlerec')
  // async getOneData() {
  //   const data = await this.expenseRepository.findOne({
  //     where: { id: 57 },
  //     relations: ['user_expense', 'user_expense.user'],
  //   });

  //   // return data;
  //   // console.log(expense)

  //   const userIds = data.user_expense.map((ele) => ele.user.id.toString());
  //   // console.log(expense, 'expense', body, 'body');
  // }
  @Patch('/:id')
  @UseGuards(AuthGuard, new PermissionsGuard('canUpdate', 'expense'))
  async updateExpense(
    @Param('id') id: string,
    @Body() body: UpdateExpenseDto,
    @Response() res,
  ) {
    const expense = await this.expenseService.findOneExpense(parseInt(id));
    // console.log(expense, body, id, 'hahahhhaahahh');
    if (!expense) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Expense Not Found' });
    }
    const updatedExpense = await this.expenseService.updateExpense(
      body,
      expense,
      id,
    );
    if (!updatedExpense) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Expense Updated Successfully',
      data: updatedExpense,
    });
  }
}
