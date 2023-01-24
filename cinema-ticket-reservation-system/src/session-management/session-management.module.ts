import { Module } from '@nestjs/common';
import { SessionManagementService } from './session-management.service';
import { SessionManagementController } from './session-management.controller';

@Module({
  controllers: [SessionManagementController],
  providers: [SessionManagementService]
})
export class SessionManagementModule {}
