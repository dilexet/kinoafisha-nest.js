import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { User } from '../../database/entity/User';
import { RegisterDto } from '../dto/register.dto';
import { GoogleUserDto } from '../dto/google-user.dto';

@Injectable()
export class AuthorizeMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, RegisterDto, User);
            createMap(mapper, GoogleUserDto, User);
        };
    }
}