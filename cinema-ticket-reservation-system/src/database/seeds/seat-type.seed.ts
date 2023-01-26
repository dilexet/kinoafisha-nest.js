import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { SeatType } from '../entity/seat-type';
import SeatTypesEnum from '../../shared/enums/seat-types.enum';

export default class SeatTypeSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {

    const seatTypes = Object.entries(SeatTypesEnum).map(([key, value]) => {
      return { name: value };
    });
    const seatTypeRepository = dataSource.getRepository(SeatType);
    await seatTypeRepository.insert(seatTypes);
  }
}