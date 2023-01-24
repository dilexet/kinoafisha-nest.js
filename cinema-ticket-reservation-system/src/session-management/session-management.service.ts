import { Injectable } from '@nestjs/common';
import { CreateSessionManagementDto } from './dto/create-session-management.dto';
import { UpdateSessionManagementDto } from './dto/update-session-management.dto';

@Injectable()
export class SessionManagementService {
  create(createSessionManagementDto: CreateSessionManagementDto) {
    return 'This action adds a new sessionManagement';
  }

  findAll() {
    return `This action returns all sessionManagement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sessionManagement`;
  }

  update(id: number, updateSessionManagementDto: UpdateSessionManagementDto) {
    return `This action updates a #${id} sessionManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} sessionManagement`;
  }
}
