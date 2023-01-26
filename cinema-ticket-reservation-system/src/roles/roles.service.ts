import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { RoleViewDto } from './dto/role-view.dto';
import { RoleRepository } from '../database/repository/role.repository';
import { Role } from '../database/entity/role';

@Injectable()
export class RolesService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly roleRepository: RoleRepository,
  ) {
  }

  async findAllAsync(): Promise<RoleViewDto[]> {
    const roles = await this.roleRepository.getAll();
    return this.mapper.mapArray(roles, Role, RoleViewDto);
  }
}
