import { Controller, Post } from '@nestjs/common';
import { UserBalanceService } from './user-balance.service';
@Controller('user-balance')
export class UserBalanceController {
  constructor(private userBalanceService: UserBalanceService) {}
}
