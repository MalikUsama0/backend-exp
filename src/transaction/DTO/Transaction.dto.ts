import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionDto {
  //   @IsNotEmpty()
  //   id: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  //   @IsNotEmpty()
  //   created_at: Date;

  //   @IsNotEmpty()
  //   updated_at: Date;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
