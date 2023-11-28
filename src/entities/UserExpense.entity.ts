import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { IsDate } from 'class-validator';
import { Expense } from './Expense.entity';

@Entity()
export class UserExpense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  shared_expense: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.user_expense, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Expense, (expense) => expense.user_expense)
  expense: Expense;
}
