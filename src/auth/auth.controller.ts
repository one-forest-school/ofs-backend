import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  AuthenticateUser,
  ConfirmationOTP,
  ResendConfirmation,
} from './auth.interface';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CognitoService } from './service/cognito.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: CognitoService) {}

  @Post('login')
  async login(@Body() authenticateRequest: AuthenticateUser) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('register')
  async signup(@Body() signupRequest: RegisterAuthDto) {
    try {
      return await this.authService.registerUser(signupRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('confirmation')
  async confirmation(@Body() confirmationOTP: ConfirmationOTP) {
    try {
      return this.authService.confirmUser(confirmationOTP);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('resendconfirmation')
  async resendconfirmation(@Body() confirmationOTP: ResendConfirmation) {
    try {
      return this.authService.resendConfirmation(confirmationOTP);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
