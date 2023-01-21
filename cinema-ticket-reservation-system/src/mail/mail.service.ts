import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserInterface } from '../authorize/interfaces/user.interface';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendUserConfirmationAsync(user: UserInterface, link: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Cinema ticket reservation system! Please, confirm your Email',
            template: './confirmation',
            context: {
                name: user.name,
                link: link,
            },
        });
    }
}
