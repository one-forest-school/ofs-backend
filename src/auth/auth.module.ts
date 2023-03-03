import { Module } from '@nestjs/common';
import { CognitoService } from './service/cognito.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from './auth.config';

@Module({
  imports: [ConfigModule.forFeature(authConfig)],
  controllers: [AuthController],
  providers: [CognitoService],
})
export class AuthModule {}
