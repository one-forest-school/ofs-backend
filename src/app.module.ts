import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule, ConfigModule.forRoot({
    envFilePath: [".env.development"],
    load: [configuration]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
