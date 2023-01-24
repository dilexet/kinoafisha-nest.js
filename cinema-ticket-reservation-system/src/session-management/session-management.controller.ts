import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionManagementService } from './session-management.service';
import { CreateSessionManagementDto } from './dto/create-session-management.dto';
import { UpdateSessionManagementDto } from './dto/update-session-management.dto';

@Controller('session-management')
export class SessionManagementController {
  constructor(private readonly sessionManagementService: SessionManagementService) {}

  @Post()
  create(@Body() createSessionManagementDto: CreateSessionManagementDto) {
    return this.sessionManagementService.create(createSessionManagementDto);
  }

  @Get()
  findAll() {
    return this.sessionManagementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionManagementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionManagementDto: UpdateSessionManagementDto) {
    return this.sessionManagementService.update(+id, updateSessionManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionManagementService.remove(+id);
  }
}
