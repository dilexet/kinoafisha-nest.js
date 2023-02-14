import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from '../database/repository/movie.repository';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { Comment } from '../database/entity/comment';
import { Movie } from '../database/entity/movie';
import { CommentsService } from './comments.service';
import { CommentRepository } from '../database/repository/comment.repository';
import { UserProfile } from '../database/entity/user-profile';
import { CommentsGateway } from './comments.gateway';
import { CommentsMapperProfile } from './mapper/comments.mapper-profile';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Movie, UserProfile])],
  providers: [
    CommentsMapperProfile,
    CommentsGateway,
    CommentsService,
    MovieRepository, CommentRepository, UserProfileRepository,
  ],
})
export class CommentsModule {
}
