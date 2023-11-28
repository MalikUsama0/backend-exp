import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { Transaction } from 'src/entities/Transaction.entity';
import { Repository } from 'typeorm';
import { TransactionDto } from './DTO/Transaction.dto';
import { TransactionService } from './transaction.service';
import { PermissionsGuard } from 'src/auth/permissions.guard';
@Controller('transaction')
export class TransactionController {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private transactionService: TransactionService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, new PermissionsGuard('canCreate', 'transaction'))
  async addTransaction(@Body() bodyTransaction: TransactionDto) {
    return this.transactionService.createTransaction(bodyTransaction);
  }
}
