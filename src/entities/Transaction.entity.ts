import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User.entity'; // Import the User entity if needed
import {
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsPhoneNumber,
  IsDate,
  Length,
  IsString,
  IsInt,
} from 'class-validator';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.id) // If you have a relationship from User to Transaction
  // user: User;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @Column()
  userId: User['id'];

  @Column()
  @IsNotEmpty()
  @IsInt()
  amount: number;

  // @Column('float')
  // @IsNotEmpty()
  // balance: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;
}
