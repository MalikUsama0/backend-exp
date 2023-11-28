import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { ExpenseModule } from './expense/expense.module';
import { TransactionModule } from './transaction/transaction.module';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailingModule } from './mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserBalanceModule } from './user-balance/user-balance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    ExpenseModule,
    TransactionModule,
    AuthModule,
    MailingModule,
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io', // Replace with your SMTP server
        port: 2525, // Replace with your SMTP port
        // secure: false, // Set to true for SSL/TLS connections
        auth: {
          user: process.env.USER_NAME!,
          pass: process.env.PASSWORD!,
        },
      },
      defaults: {
        from: '"noreply" email@iplex.co', // Replace with your name and email
      },
      template: {
        dir: process.cwd() + '/templates/', // Path to your email templates directory
        adapter: new HandlebarsAdapter(), // Use the template engine you prefer
        options: {
          strict: true,
        },
      },
    }),
    UserBalanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
