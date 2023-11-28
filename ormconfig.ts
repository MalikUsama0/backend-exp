console.log(process.env.DB_HOST, process.env.DB_PORT, 'data base hosst');

module.exports = {
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  username: 'postgres',
  password: 'postgresql123',
  database: 'exp_management_system',
  entities: [`${__dirname}/src/entities/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/db/migrations/*{.ts,.js}`],
  // cli: {
  //   entitiesDir: 'src',
  //   migrationsDir: `${__dirname}/db/migrations`,
  //   seedsDir: 'src/database/seeds',
  // },
  seeds: ['dist/src/database/seeds/*.seed.js'],
  factories: ['dist/src/database/factories/*.factories.js'],
};
