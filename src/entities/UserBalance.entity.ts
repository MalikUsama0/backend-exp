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
import { baseEntity } from 'src/common/base-Entity';
import { User } from './User.entity';
@Entity()
export class UserBalance extends baseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'decimal' })
  total_expenses: number;

  @Column({ nullable: true, type: 'decimal' })
  total_paid: number;

  @Column({ nullable: true, type: 'decimal' })
  pending_amount: number;

  @Column({ nullable: true, type: 'decimal' })
  previous_pending: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;
  @Column()
  userId: User['id'];
}
