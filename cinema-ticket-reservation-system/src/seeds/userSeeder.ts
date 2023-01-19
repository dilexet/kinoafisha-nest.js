import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seeder } from 'typeorm-extension';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import RoleEnum from '../enums/role.enum';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {

    const roleRepository = dataSource.getRepository(Role);
    await roleRepository.insert([
      {
        name: RoleEnum.Admin,
      },
      {
        name: RoleEnum.User,
      },
    ]);

    const userRepository = dataSource.getRepository(User);
    const role = await roleRepository.findOneBy({ name: RoleEnum.Admin });
    await userRepository.insert([
      {
        name: 'admin',
        email: 'admin@gmail.com',
        passwordHash: await bcrypt.hash('root', 5),
        isActivated: true,
        role: role,
      },
    ]);
  }
}