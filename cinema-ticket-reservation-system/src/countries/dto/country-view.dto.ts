import { AutoMap } from '@automapper/classes';

export class CountryViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}