import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class BaseClass { }

export class RecoveryTokenDto extends PartialType(BaseClass) {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class ResetPasswordDto extends PartialType(BaseClass) {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description:'Token sent to email'})
  readonly token: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class LoginDto extends PartialType(BaseClass) {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class GoogleStrategyDto {
  @IsString()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  picture: string;
  @IsString()
  accessToken: string
}

export class JWTDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string
}
