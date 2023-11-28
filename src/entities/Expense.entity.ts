import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import {
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { UserExpense } from './UserExpense.entity';
import { CreateType } from '../expense/expense.dto';
import { baseEntity } from '../common/base-Entity';

@Entity()
export class Expense extends baseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Title is too short',
  })
  @MaxLength(200, {
    message: 'Title is too long',
  })
  title: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Description is too short',
  })
  @MaxLength(1000, {
    message: 'Description is too long',
  })
  description: string;

  @Column({ type: 'timestamp' })
  @IsDate()
  due_date: Date;

  @ManyToOne(() => User, { nullable: false }) // If you have a relationship from User to Expense
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => UserExpense, (user_expense) => user_expense.expense)
  user_expense: UserExpense;

  @Column({ default: CreateType.ALL })
  type: CreateType;
}
