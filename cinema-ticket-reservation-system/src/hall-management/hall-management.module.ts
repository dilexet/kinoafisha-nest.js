import { Module } from '@nestjs/common';
import { HallManagementService } from './hall-management.service';
import { HallManagementController } from './hall-management.controller';

@Module({
  controllers: [HallManagementController],
  providers: [HallManagementService]
})
export class HallManagementModule {}
