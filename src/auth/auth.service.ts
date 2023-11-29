import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import bcrypt from 'bcryptjs';
import { MoreThan, Repository } from 'typeorm';
import { SignupDto } from './auth.dto';
import { Role } from 'src/entities/Role.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { UserToken } from 'src/entities/UserToken.entity';
import { UpdateUserDto } from 'src/user/DTO/update-user.dto';
import { VerifyResetPasswordDto } from './DTO/userToken.dto';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
// import { sendMail } from 'src/helper/nodemailer.config';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  constructor(
    readonly mailService: MailingService,
    private jwtService: JwtService,
    private userBalanceService: UserBalanceService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  async signIn(email: string, pass: string) {
    // const user: User = await this.userRepository.findOneBy({ email });
    const user: User = await this.userRepository.findOne({
      where: { email: email },
      relations: [
        'role',
        'role.rolePermission',
        'role.rolePermission.permission',
      ],
    });
    // console.log(user)
    const permissions_ = user?.role?.rolePermission?.map(
      (ele) => ele.permission,
    );
    console.log(user, 'user from login');
    if (!user) {
      return { success: false, message: 'Email not found' };
    }
    const password = await bcrypt.compareSync(pass, user.password);
    if (!password) return { success: false, message: 'Invalid Credentials' };
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.title,
      permissions: permissions_,
    };
    return {
      success: true,
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.title,
        permissions: permissions_,
        // another: user,
      },
    };
  }

  async signup(userInfo: SignupDto) {
    const data = await this.roleRepository.findOneBy({ title: 'user' });
    const { password } = userInfo;
    const hashedPassword = await bcrypt.hashSync(password, this.saltRounds);
    userInfo['active'] = false;
    userInfo['role'] = data.id;
    userInfo.password = hashedPassword;

    // this.userBalanceService.create()

    const userData = await this.userRepository.save(userInfo);
    const userBalanceData = {
      userId: userData.id,
      total_expenses: 0,
      total_paid: 0,
      pending_amount: userInfo.pendingAmount,
      previous_pending: userInfo.pendingAmount,
    };
    console.log(userData, userBalanceData, 'add new user ');
    await this.userBalanceService.create(userBalanceData);
    return userData;
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    const hashedToken = await bcrypt.hashSync(token, 10);
    const currentDate = new Date();
    try {
      const newToken = new UserToken();

      newToken.forgotPasswordToken = hashedToken;
      newToken.forgotPasswordTokenExpiry = new Date(
        currentDate.getTime() + 5 * 60000,
      );
      newToken.user = user;
      await this.userTokenRepository.save(newToken);
      const resetPasswordLink = `${process.env
        .DEV_DOMAIN!}/auth/verify?token=${hashedToken}`;
      await this.mailService.sendEmail(email, user.name, resetPasswordLink);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async verifyUser(token: string): Promise<UserToken> {
    return await this.userTokenRepository.findOne({
      where: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: MoreThan(new Date()),
      },
    });
  }

  async updatePassword({
    newPassword: password,
    token,
  }: VerifyResetPasswordDto): Promise<UpdateUserDto> {
    const hashedPassword = await bcrypt.hashSync(password, this.saltRounds);
    const userToken = await this.userTokenRepository.findOne({
      where: { forgotPasswordToken: token },
      relations: ['user'],
    });
    const updateUser = userToken.user;
    updateUser.password = hashedPassword;
    return this.userRepository.save(updateUser);
  }
}
