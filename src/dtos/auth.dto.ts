import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RecoveryTokenDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly token: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class GoogleStrategyDto {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string
}

export class JWTDto {
  readonly token: string
}
