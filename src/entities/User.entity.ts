import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsDate,
  Length,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from './Role.entity';
import { UserToken } from './UserToken.entity';
import { UserExpense } from './UserExpense.entity';
import { Transaction } from './Transaction.entity';
import { UserBalance } from './UserBalance.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Length(3, 30)
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsEmail() // Validate that the input is a valid email address
  email: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  @Length(10, 15, {
    message: 'Phone number must be between 10 and 15 characters long',
  })
  phone: string;

  @Column()
  @IsBoolean()
  active: boolean;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  @OneToMany(() => UserToken, (token) => token.id)
  token?: UserToken;

  @OneToMany(() => UserExpense, (user_expense) => user_expense.user, {
    onDelete: 'CASCADE',
  })
  user_expense?: UserExpense;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  user_transaction: Transaction;

  @OneToMany(() => UserBalance, (userBalance) => userBalance.user, {
    onDelete: 'CASCADE',
  })
  user_balance: UserBalance;
}
