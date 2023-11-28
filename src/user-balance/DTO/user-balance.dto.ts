import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddUserBalanceDto {
  @IsNotEmpty()
  total_expenses: number;

  @IsNotEmpty()
  total_paid: number;

  @IsNotEmpty()
  pending_amount: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1) // Assuming role IDs start from 1
  userId: number;
}
