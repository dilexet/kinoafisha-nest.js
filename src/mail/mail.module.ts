import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import mailConfigConstants from './constants/mail-config.constants';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: mailConfigConstants.EMAIL_HOST,
        port: mailConfigConstants.EMAIL_PORT,
        secure: false,
        auth: {
          user: mailConfigConstants.EMAIL_AUTH_USER,
          pass: mailConfigConstants.EMAIL_AUTH_PASS,
        },
      },
      defaults: {
        from: mailConfigConstants.EMAIL_FROM,
        name: mailConfigConstants.NAME_FROM,
      },
      template: {
        dir: join(process.cwd(), 'dist', 'shared', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
