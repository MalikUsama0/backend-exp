import {
  Controller,
  UseGuards,
  Get,
  Request,
  Patch,
  Param,
  Body,
  HttpStatus,
  Response,
  Query,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ActivateUserDto } from './DTO/activate-user.dto';
import { UserQuery } from 'src/interfaces/expense.types';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  IsNull,
  Like,
} from 'typeorm';
import * as moment from 'moment';
// import { User } from 'src/entities/User.entity';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userBalanceService: UserBalanceService,
  ) {}
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getAllUsers(@Query() query: UserQuery) {
    const count = query.count;
    const textSearch = query.search;
    const data = await this.userService.getAllUsers(
      {
        where: [
          { name: Like(`%${textSearch}%`) },
          { email: Like(`%${textSearch}%`) },
        ],

        select: {
          id: true,
          name: true,
          email: true,
          active: true,
          phone: true,
          created_at: true,
          updated_at: true,
        },
        order: {
          created_at: 'ASC',
        },
        take: query.limit,
        skip: query.offset,
      },
      count,
      textSearch,
    );

    return data;
  }

  @Get('users-expense')
  @UseGuards(AuthGuard)
  async getUserWithExpense(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('count') count: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    console.log(' year ', year, month, Number(year) - 1);
    const firstDay = moment(`${year}-${month}-01`, 'YYYY-MM-DD').format(
      'YYYY-MM-DD HH:mm:ss.SSSSSS',
    );
    const lastDay = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
      .endOf('month')
      .format('YYYY-MM-DD HH:mm:ss.SSSSSS');

    let previousMonth: string | number = Number(month) - 1;
    let previousYear;
    // previousMonth =
    //   previousMonth < 10 ? `0${previousMonth}` : previousMonth.toString();

    if (previousMonth == 0) {
      previousMonth = '12';
      previousYear = (Number(year) - 1).toString();
    } else {
      previousMonth =
        previousMonth < 10 ? `0${previousMonth}` : previousMonth.toString();
      previousYear = year;
    }

    const previousFirstDay = moment(
      `${previousYear}-${previousMonth}-01`,
      'YYYY-MM-DD',
    ).format('YYYY-MM-DD HH:mm:ss.SSSSSS');
    const previousLastDay = moment(
      `${previousYear}-${previousMonth}-01`,
      'YYYY-MM-DD',
    )
      .endOf('month')
      .format('YYYY-MM-DD HH:mm:ss.SSSSSS');

    // console.log(
    //   previousFirstDay,
    //   previousLastDay,
    //   'previous month and previous year',
    // );

    return this.userService.findAll(
      firstDay,
      lastDay,
      count,
      limit,
      offset,
      previousFirstDay,
      previousLastDay,
    );
  }
  @Get('/all-active-users')
  @UseGuards(AuthGuard)
  async findUsers() {
    const users = await this.userService.findUsers({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
      order: {
        name: 'ASC',
      },
    });
    return users;
  }

  @Patch('/:userId')
  @UseGuards(AuthGuard, new PermissionsGuard('canUpdate', 'user'))
  async activateUser(
    @Param('userId') userId: number,
    @Body() body: ActivateUserDto,
    @Response() res,
  ) {
    console.log(userId, 'userId');
    const response = await this.userService.updateUserStatus(userId, body);
    if (response) {
      return res.status(HttpStatus.OK).json({
        success: true,
        data: { id: response.id, name: response.name, active: response.active },
        message: 'User Status Updated Successfully',
      });
    }
  }

  @Post('/adduserwithSP')
  async userWithSP() {
    const data = await this.userService.addUserwithSP();
    return data;
  }
}
