import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum CreateType {
  ALL = 'ALL',
  SELECTED = 'SELECTED',
}

export class ExpenseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  due_date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsEnum(CreateType)
  type?: CreateType;

  userIds?: number[];
}

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  due_date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  user_id?: number;

  @IsEnum(CreateType)
  type?: CreateType;

  userIds?: number[];
}

export class UpdateExpenseDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNotEmpty()
  @IsOptional()
  due_date: Date;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  userIds?: number[];
  @IsEnum(CreateType)
  type?: CreateType;
}
