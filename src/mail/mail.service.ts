import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {
  }

  async sendUserConfirmationLinkAsync(name: string, email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Cinema ticket reservation system! Please, confirm your Email',
      template: './confirmation',
      context: {
        name: name,
        link: link,
      },
    });
  }

  async sendUserConfirmationLinkAndLoginAsync(name: string, email: string, password: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Cinema ticket reservation system! Please, confirm your Email',
      template: './confirmation-login',
      context: {
        name: name,
        login: email,
        password: password,
        link: link,
      },
    });
  }
}
