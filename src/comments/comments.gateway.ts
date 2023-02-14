import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serveClient: false,
  namespace: 'comments-gateway',
})
export class CommentsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly commentsService: CommentsService) {
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('comment:add')
  async handleCommentAdd(client: Socket, comment: CommentDto): Promise<void> {
    const result = await this.commentsService.addComment(comment);
    this.server.emit('comment-receive:add', result);
  }

  @SubscribeMessage('comment:getAll')
  async handleCommentsGet(client: Socket, movieId: string): Promise<void> {
    const result = await this.commentsService.getComments(movieId);
    this.server.emit('comment-receive:get', result);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }
}