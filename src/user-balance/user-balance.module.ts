import { Module } from '@nestjs/common';
import { UserBalanceController } from './user-balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBalance } from 'src/entities/UserBalance.entity';
import { UserBalanceService } from './user-balance.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserBalance])],
  providers: [UserBalanceService],
  controllers: [UserBalanceController],
  exports: [UserBalanceService],
})
export class UserBalanceModule {}
