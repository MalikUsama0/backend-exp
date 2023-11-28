import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNotEmpty()
  @IsEmail() // Validate that the input is a valid email address
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  pendingAmount: number;
}
