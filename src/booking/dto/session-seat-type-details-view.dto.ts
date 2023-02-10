import { AutoMap } from '@automapper/classes';

export class SessionSeatTypeDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  price: number;

  @AutoMap()
  name: string;
}