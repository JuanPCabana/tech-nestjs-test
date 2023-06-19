import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RecoveryTokenDto, ResetPasswordDto } from 'src/modules/auth/dtos/auth.dto';
import { LocalStrategy } from '../oAuth/strategies/local.strategy';
import { AuthService } from '../services/auth.service';
import { PasswordService } from '../services/password.service';
import { EmailService } from 'src/modules/email/services/email.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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
  @ApiOperation({summary:'Email and password login'})
  async login(@Res() res: Response, @Body() payload: LoginDto) {
    const response = await this.authService.loginUser(res, payload);
    return response
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary:'OAuth authentication with google'})
  async googleAuth(@Req() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary:'OAuth authentication with google redirection'})
  googleAuthRedirect(@Res() res: Response, @Req() req: Request) {
    return this.authService.googleLogin(res, req)
  }

  @Post('recovery')
  @ApiOperation({summary:'Generate a token that is stored in the database for password restoration.'})
  async generateRecoveryToken(@Res() res: Response, @Body() payload: RecoveryTokenDto) {
    return this.authService.generateRecoveryToken(res, payload)
  }

  @Post('resetPassword')
  @ApiOperation({summary:'Reset the password.'})
  async recoveryPassword(@Res() res: Response, @Body() payload: ResetPasswordDto) {
    return this.authService.validateRecoveryToken(res, payload)
  }

}
