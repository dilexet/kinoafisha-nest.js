import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seeder } from 'typeorm-extension';
import { User } from '../entity/user';
import { Role } from '../entity/role';
import RoleEnum from '../../shared/enums/role.enum';
import { UserProfile } from '../entity/user-profile';

export default class UserSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roles = [
      {
        name: RoleEnum.Admin,
      },
      {
        name: RoleEnum.User,
      },
    ];
    const rolesCreated = await dataSource.getRepository(Role).save(roles);

    const user = {
      name: 'admin',
      email: 'admin@gmail.com',
      passwordHash: await bcrypt.hash('root', 5),
      isActivated: true,
      role: rolesCreated.find((x) => x.name == RoleEnum.Admin),
    };
    const userCreated = await dataSource.getRepository(User).save(user);

    const userProfile = {
      user: userCreated,
    };
    await dataSource.getRepository(UserProfile).save(userProfile);
  }
}
