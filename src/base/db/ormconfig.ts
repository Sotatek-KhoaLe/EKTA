export const typeOrmOptionsGenerate = (config) => ({
  type: config.DB_TYPE,
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  synchronize: false,
  extra: {
    connectionLimit: 10,
  },
  entities: [
    config.NODE_ENV === config.JEST //
      ? 'src/**/entities/*.entity.ts'
      : 'dist/src/**/entities/*.entity{.ts,.js}',
  ],
  migrationsTableName: 'migration',
  migrations: ['src/migrations/confirmed_*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  useNewUrlParser: true,
});
