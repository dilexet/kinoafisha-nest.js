import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserInterface } from '../interfaces/user.interface';

export class RegisterDto implements UserInterface {
    @ApiProperty({
        type: String,
        description: 'User name',
    })
    @IsNotEmpty()
    @AutoMap()
    name: string;

    @ApiProperty({
        type: String,
        description: 'User email',
    })
    @IsEmail()
    @AutoMap()
    email: string;

    @ApiProperty({
        type: String,
        description: 'User password',
    })
    @IsNotEmpty()
    password: string;
}