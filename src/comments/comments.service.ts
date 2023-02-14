import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../database/repository/comment.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { CommentDto } from './dto/comment.dto';
import { CommentViewDto } from './dto/comment-view.dto';
import { Comment } from '../database/entity/comment';
import { CommentInfo } from './dto/comment-info-view.dto';
import { CommentArrayViewDto } from './dto/comment-array-view.dto';

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

    const commentViewDto = new CommentViewDto();
    commentViewDto.movieId = movie.id;
    commentViewDto.comment = this.mapper.map(createdComment, Comment, CommentInfo);

    return commentViewDto;
  }

  async getComments(movieId: string): Promise<CommentArrayViewDto> {
    const movie = await this.movieRepository
      .getById(movieId)
      .include(x => x.comments)
      .orderByDescending(x => x.createdDate)
      .thenInclude(x => x.userProfile)
      .thenInclude(x => x.user);

    if (!movie) {
      return null;
    }

    const commentArrayViewDto = new CommentArrayViewDto();
    commentArrayViewDto.movieId = movie.id;
    commentArrayViewDto.comments = this.mapper.mapArray(movie.comments, Comment, CommentInfo);

    return commentArrayViewDto;
  }
}