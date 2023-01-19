import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'User email',
    })
    email: string;
    @ApiProperty({
        type: String,
        description: 'User password',
    })
    password: string;
}