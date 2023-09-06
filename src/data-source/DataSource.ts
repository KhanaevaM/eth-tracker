const { DataSource } = require('typeorm');

require('dotenv').config();
for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: [`src/migrations/*{.ts,.js}')`],
  cli: {
    migrationsDir: 'dist/migrations',
  },
});

module.exports = { connectionSource };
