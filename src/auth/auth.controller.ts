import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { SignInDto, SignupDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { VerifyResetPasswordDto } from './DTO/userToken.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Response() res) {
    const data = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    if (!data.success)
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Login Failed', data });
    return res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Login Successfully', data });
  }

  // @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard, new PermissionsGuard('canCreate', 'user'))
  @Post('signup')
  async createUser(@Body() signup: SignupDto, @Response() res) {
    const existUser = await this.userService.findUser(signup.email);
    if (existUser) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ success: false, message: 'User Already Exists' });
    }
    const newUser = await this.authService.signup(signup);
    if (newUser) {
      return res
        .status(HttpStatus.CREATED)
        .json({ success: true, message: 'User Created Successfully' });
    } else {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: 'Missing Data' });
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: { email: string }, @Response() res) {
    await this.authService.forgotPassword(body.email);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Reset Password Email Sent Successfully on ' + body.email,
    });
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: VerifyResetPasswordDto, @Response() res) {
    const tokenFromDb = await this.authService.verifyUser(body.token);
    if (!tokenFromDb) {
      res.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).json({
        success: false,
        message: 'Invalid Token',
      });
    } else {
      try {
        await this.authService.updatePassword(body);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'server error',
          serverMessage: error.message,
        });
      }
      res
        .status(HttpStatus.ACCEPTED)
        .json({ success: true, message: 'Password Updated Success' });
    }
  }
}
