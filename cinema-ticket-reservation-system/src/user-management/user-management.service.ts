import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserManagementService {
  async create(userDto: UserDto) {
    return 'This action adds a new userManagement';
  }

  async findAll() {
    return `This action returns all userManagement`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} userManagement`;
  }

  async update(id: string, userDto: UserDto) {
    return `This action updates a #${id} userManagement`;
  }

  async remove(id: string) {
    return `This action removes a #${id} userManagement`;
  }
}
