export const AppConfiguration = () => ({
  DB_NAME: process.env.DB_NAME || 'localhost',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT) ?? 3000,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  LOG_MAX_SIZE: process.env.LOG_MAX_SIZE || '20m',
  LOG_EXPIRATION: process.env.LOG_EXPIRATION || '14d',
});
