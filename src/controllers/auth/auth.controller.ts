import { Body, Controller, Post } from '@nestjs/common';
import { RecoveryTokenDto } from 'src/dtos/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @Post()
  generateRecoveryToken(@Body() payload: RecoveryTokenDto) {
    return this.authService.generateRecoveryToken(payload.email)
  }

}
