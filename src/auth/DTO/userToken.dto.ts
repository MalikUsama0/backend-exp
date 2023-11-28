import { User } from 'src/entities/User.entity';

export class UserTokenDto {
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
  user: User;
}

export class VerifyResetPasswordDto {
  token: string;
  newPassword: string;
}
