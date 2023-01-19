import {
    Body, Controller, Get,
    HttpStatus, Inject, Param, Post, Redirect, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthorizeService } from './authorize.service';
import config from './config/authorize.config';
import { ConfigType } from '@nestjs/config';

@ApiTags('Authorize')
@Controller('authorize')
export class AuthorizeController {
    constructor(
        private authorizeService: AuthorizeService,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
    ) {
    }

    @ApiBody({
        type: LoginDto,
        description: 'User login',
    })
    @Post('login')
    login(@Res() res: Response, @Body() loginDto: LoginDto) {
        return res.status(HttpStatus.OK).json(loginDto);
    }

    @ApiBody({
        type: RegisterDto,
        description: 'User register',
    })
    @Post('register')
    async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
        const result = await this.authorizeService.registration(registerDto);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiBody({
        type: RegisterDto,
        description: 'Activate account with link from email',
    })
    @Redirect('http://localhost:3000', 301)
    @Get('activate/:link')
    async activate(@Res() res: Response, @Param('link') link: string) {
        await this.authorizeService.activate(link);
    }

    // @Get('google')
    // @UseGuards(GoogleOauthGuard)
    // async auth() {
    // }
    //
    // @Get('google/callback')
    // @UseGuards(GoogleOauthGuard)
    // async googleAuthCallback(@Req() req, @Res() res: Response) {
    //     const token = await this.authorizeService.signIn(req.user);
    //
    //     res.cookie('access_token', token, {
    //         maxAge: 2592000000,
    //         sameSite: true,
    //         secure: false,
    //     });
    //
    //     return res.status(HttpStatus.OK);
    // }

    // @ApiBody({
    //     type: RegisterDto,
    //     description: 'User logout',
    // })
    // @Post('logout')
    // logout(@Res() res: Response, @Body() registerDto: RegisterDto) {
    //     return res.status(HttpStatus.OK).json(registerDto);
    // }
    //
    // @ApiBody({
    //     type: RegisterDto,
    //     description: 'Token refresh',
    // })
    // @Post('refresh')
    // refresh(@Res() res: Response, @Body() registerDto: RegisterDto) {
    //     return res.status(HttpStatus.OK).json(registerDto);
    // }
    //
}