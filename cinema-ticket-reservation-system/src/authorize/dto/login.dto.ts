import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'User email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        description: 'User password',
    })
    @IsNotEmpty()
    password: string;
}