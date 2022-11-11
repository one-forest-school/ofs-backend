import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  AuthenticateUser,
  SignUpUser,
  ConfirmationOTP,
  ResendConfirmation,
} from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authenticateRequest: AuthenticateUser) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('signup')
  async signup(@Body() signupRequest: SignUpUser) {
    try {
      return this.authService.signUpUser(signupRequest);
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
