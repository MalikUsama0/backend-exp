import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsInt,
  Min,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Invalid phone number' }) // Add your country code or null for any country
  phone: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsInt()
  @Min(1) // Assuming role IDs start from 1
  role_id: number;
}
