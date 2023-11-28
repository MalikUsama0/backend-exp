import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { MailingModule } from 'src/mailing/mailing.module';
import { UserToken } from 'src/entities/UserToken.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  imports: [
    UserModule,
    UserBalanceModule,
    TypeOrmModule.forFeature([UserToken]),
    MailingModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    RoleModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
