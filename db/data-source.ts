import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
// import { ConfigureOption, ConnectionOptions } from 'typeorm-seeding';
// import { SeederOptions } from 'typeorm-extension';
dotenvConfig();
console.log(__dirname, 'dirn name');
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],

  // cli: {
  //   entitiesDir: 'src',
  //   migrationsDir: 'src/database/migrations',
  //   seedsDir: 'src/database/seeds',
  // },
  // seeds: [`${__dirname}/../dist/db/src/database/seeds/**/*.js`],
  // factories: [`${__dirname}/../dist/db/src/database/factories/**/*.js`],

  //  namingStrategy:
  extra: {
    ssl: {
      rejectUnauthorized: false, // Set to true in production for proper SSL verification
      sslmode: 'require',
    },
  },
};
console.log(
  process.env.DB_HOST,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  '---- hostndfnd',
);
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

// const port = process.env.PORT;
// Server.listen(PORT,()=>{
//   console.log("server listen on "+PORT)
//   console.log(process.env.NAME)
// })
