import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Genre } from '../entity/genre';
import { GenreEnum } from '../../shared/enums/genre.enum';

export default class GenreSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {

    const genres = Object.entries(GenreEnum).map(([key, value]) => {
      return { name: value };
    });
    const genreRepository = dataSource.getRepository(Genre);
    await genreRepository.insert(genres);
  }
}