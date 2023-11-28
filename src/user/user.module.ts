import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserSchema } from './user.schema';
import { User } from 'src/entities/User.entity';
import { UserBalance } from 'src/entities/UserBalance.entity';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
@Module({
  imports: [TypeOrmModule.forFeature([User, UserBalance]), UserBalanceModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
