import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserLockStatus } from '../../shared/enums/user-lock-status.enum';

export class LockStatusDto {
  @ApiProperty({
    type: 'enum',
    enum: UserLockStatus,
    description: 'user lock status',
  })
  @IsNotEmpty()
  lockStatus: UserLockStatus;
}
