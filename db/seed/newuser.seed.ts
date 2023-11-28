// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { DataSource } from 'typeorm';
// import { User } from '../../src/entities/User.entity';
// import { Role } from '../../src/entities/Role.entity';
// export default class NewUserSeeder implements Seeder {
//   public async run(
//     dataSource: DataSource,
//     factoryManager: SeederFactoryManager,
//   ): Promise<void> {
//     await dataSource.query('TRUNCATE "user" RESTART IDENTITY;');

//     const repository = dataSource.getRepository(User);
//     const role = new Role();
//     role.id = 3;

//     await repository.insert({
//       name: 'UsamaAdmin',
//       email: 'adminusama123@gmail.com',
//       active: true,
//       phone: '03325698741',
//       password: 'qwe123!@#',
//       role: role,
//     });
//   }
// }
