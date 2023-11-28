import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class UserExpenseDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  shared_expense: number;

  @IsNotEmpty()
  created_at: Date;

  @IsNotEmpty()
  @IsInt()
  user: number;

  @IsNotEmpty()
  @IsInt()
  expense: number;
}
