import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AppConfiguration } from './config/app.config';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [AppConfiguration] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 5432,
      database: process.env.DB_NAME ?? 'test',
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      autoLoadEntities: true,
      synchronize: true, // En prod poner a false y usar migraciones en su lugar
    }),
    CommonModule,
    AuthModule,
    CustomLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
