import { SessionSeat } from '../../database/entity/session-seat';
import { TicketState } from '../enums/ticket-state.enum';

export const hallWorkLoadCalculation = (
  sessionSeats: SessionSeat[],
): number => {
  const numberFreeSeats = sessionSeats.filter(
    (x) => x.ticketState === TicketState.Free,
  ).length;
  const numberSeats = sessionSeats.length;

  return (numberFreeSeats / numberSeats) * 100;
};
