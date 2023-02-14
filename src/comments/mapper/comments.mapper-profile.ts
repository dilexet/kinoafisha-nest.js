import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Comment } from '../../database/entity/comment';
import { CommentViewDto } from '../dto/comment-view.dto';

@Injectable()
export class CommentsMapperProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Comment, CommentViewDto,
        forMember(source => source.userProfileId,
          mapFrom(dest => dest.userProfile?.id)),
        forMember(source => source.userName,
          mapFrom(dest => dest.userProfile?.user?.name)),
        forMember(source => source.userEmail,
          mapFrom(dest => dest.userProfile?.user?.email)),
        forMember(source => source.movieId,
          mapFrom(dest => dest.movie?.id)),
        forMember(source => source.text,
          mapFrom(dest => dest.text)),
      );
    };
  }
}