import { AutoMap } from '@automapper/classes';

export class SessionViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  startDate: Date;

  @AutoMap()
  hallWorkLoad: number;

  @AutoMap()
  hallName: string;
}