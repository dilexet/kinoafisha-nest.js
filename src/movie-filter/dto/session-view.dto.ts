import { AutoMap } from '@automapper/classes';

export class SessionViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  startDate: string;

  @AutoMap()
  hallWorkLoad: number;

  @AutoMap()
  hallName: string;
}
