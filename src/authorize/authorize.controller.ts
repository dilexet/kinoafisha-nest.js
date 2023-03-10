import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizeService } from './authorize.service';
import { LogoutDto } from './dto/logout.dto';
import { TokenDto } from './dto/token.dto';
import appConfigConstants from '../shared/constants/app-config.constants';

@ApiTags('Authorize')
@Controller('authorize')
export class AuthorizeController {
  constructor(private authorizeService: AuthorizeService) {}

  @ApiBody({
    type: LoginDto,
    description: 'User login',
  })
  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const result = await this.authorizeService.loginAsync(loginDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiBody({
    type: RegisterDto,
    description: 'User register',
  })
  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    const result = await this.authorizeService.registrationAsync(registerDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiBody({
    type: LogoutDto,
    description: 'User logout',
  })
  @Post('logout')
  async logout(@Res() res: Response, @Body() logoutDto: LogoutDto) {
    await this.authorizeService.logoutAsync(logoutDto.refreshToken);
    return res.status(HttpStatus.OK).json({ message: 'logout success' });
  }

  @ApiBody({
    type: TokenDto,
    description: 'Token refresh',
  })
  @Post('refresh')
  async refresh(@Res() res: Response, @Body() tokenDto: TokenDto) {
    const result = await this.authorizeService.refreshAsync(tokenDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiParam({
    name: 'link',
    description: 'Activate account with link from email',
  })
  @Redirect(appConfigConstants.CLIENT_URL, 301)
  @Get('activate/:link')
  async activate(@Res() res: Response, @Param('link') link: string) {
    await this.authorizeService.activateAsync(link);
  }

  @ApiExcludeEndpoint()
  @Post('google')
  async googleAuthCallback(
    @Req() req,
    @Res() res: Response,
    @Body('token') token: string,
  ) {
    const result = await this.authorizeService.googleSignIn(token);
    return res.status(HttpStatus.OK).json(result);
  }
}
