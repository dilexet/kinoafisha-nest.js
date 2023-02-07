import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { UserViewDto } from '../dto/user-view.dto';
import { User } from '../../database/entity/user';
import { Role } from '../../database/entity/role';
import { RoleViewDto } from '../dto/role-view.dto';
import { UserCreateDto } from '../dto/user-create.dto';

@Injectable()
export class UserManagementMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserCreateDto, User);
      createMap(mapper, Role, RoleViewDto);
      createMap(mapper, User, UserViewDto,
        forMember(dest => dest.role,
          mapFrom(source => mapper.map(source.role, Role, RoleViewDto))),
      );
    };
  }
}