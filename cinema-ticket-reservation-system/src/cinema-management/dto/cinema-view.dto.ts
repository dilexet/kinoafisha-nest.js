import { AutoMap } from '@automapper/classes';

export class CinemaViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  country: string;

  @AutoMap()
  city: string;

  @AutoMap()
  street: string;

  @AutoMap()
  houseNumber: number;
}
