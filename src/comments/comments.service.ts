import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../database/repository/comment.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { CommentDto } from './dto/comment.dto';
import { CommentViewDto } from './dto/comment-view.dto';
import { Comment } from '../database/entity/comment';

@Injectable()
export class CommentsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private commentsRepository: CommentRepository,
    private movieRepository: MovieRepository,
    private userProfileRepository: UserProfileRepository,
  ) {
  }

  async addComment(comment: CommentDto): Promise<CommentViewDto> {
    const movie = await this.movieRepository.getById(comment?.movieId);
    if (!movie) {
      return null;
    }

    const userProfile = await this.userProfileRepository
      .getById(comment?.userProfileId)
      .include(x => x.user);
    if (!userProfile) {
      return null;
    }

    const newComment = new Comment();
    newComment.text = comment.text;
    newComment.userProfile = userProfile;
    newComment.movie = movie;
    const createdComment = await this.commentsRepository.create(newComment);

    return this.mapper.map(createdComment, Comment, CommentViewDto);
  }

  async getComments(movieId: string): Promise<CommentViewDto[]> {
    const movie = await this.movieRepository
      .getById(movieId)
      .include(x => x.comments)
      .thenInclude(x => x.userProfile)
      .thenInclude(x => x.user);

    if (!movie) {
      return null;
    }

    return this.mapper.mapArray(movie.comments, Comment, CommentViewDto);
  }
}