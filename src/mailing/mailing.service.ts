import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(email: string, name: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Iplex Expense Manager',
      template: 'action', // Name of the email template file (without the extension)
      context: { name, link }, // Data to pass to the template
    });
  }
}
