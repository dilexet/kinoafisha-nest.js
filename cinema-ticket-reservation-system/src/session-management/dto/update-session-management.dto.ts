import { PartialType } from '@nestjs/swagger';
import { CreateSessionManagementDto } from './create-session-management.dto';

export class UpdateSessionManagementDto extends PartialType(CreateSessionManagementDto) {}
