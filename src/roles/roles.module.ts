import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesMapperProfile } from './mapper/roles-mapper-profile.service';
import { RoleRepository } from '../database/repository/role.repository';
import { Role } from '../database/entity/role';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesMapperProfile, RolesService, RoleRepository],
})
export class RolesModule {}
