import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingService } from './booking.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Payload, PayloadArray } from './types/payload';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serveClient: false,
  namespace: 'booking-gateway',
})
export class BookingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly bookingService: BookingService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('booking:block')
  async handleBlockSeat(client: Socket, payload: Payload): Promise<void> {
    const result = await this.bookingService.blockSessionSeat(
      payload.sessionSeatId,
    );
    this.server.emit('booking-receive:block', {
      ...payload,
      sessionSeatId: result,
    });
  }

  @SubscribeMessage('booking:unlock')
  async handleUnlockSeat(client: Socket, payload: Payload): Promise<void> {
    const result = await this.bookingService.unlockSessionSeat(
      payload.sessionSeatId,
    );
    this.server.emit('booking-receive:unlock', {
      ...payload,
      sessionSeatId: result,
    });
  }

  @SubscribeMessage('booking:unlockAll')
  async handleUnlockAllSeats(
    client: Socket,
    payload: PayloadArray,
  ): Promise<void> {
    const result = await this.bookingService.unlockSessionSeats(
      payload.sessionSeatIds,
    );
    this.server.emit('booking-receive:unlockAll', {
      ...payload,
      sessionSeatIds: result,
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async clearExpiresSeats() {
    const result = await this.bookingService.clearExpiresSessionSeats();
    if (result) {
      for (const payloadArray of result) {
        this.server.emit('booking-receive:unlockAll', { ...payloadArray });
      }
    }
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
