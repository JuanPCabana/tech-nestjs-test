import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RecoveryTokenDto, ResetPasswordDto } from 'src/modules/auth/dtos/auth.dto';
import { LocalStrategy } from '../oAuth/strategies/local.strategy';
import { AuthService } from '../services/auth.service';
import { PasswordService } from '../services/password.service';
import { EmailService } from 'src/modules/email/services/email.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
    private readonly localStrategy: LocalStrategy,
    private readonly emailService: EmailService
  ) { }

  @Post('login')
  // @UseGuards(AuthGuard('local'))
  async login(@Body() payload: LoginDto) {
    const userInfo = await this.authService.loginUser(payload);
    return userInfo
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req)
  }

  @Post('recovery')
  async generateRecoveryToken(@Body() payload: RecoveryTokenDto) {
    return this.authService.generateRecoveryToken(payload)
  }

  @Post('resetPassword')
  async recoveryPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.validateRecoveryToken(payload)
  }

}
