import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RecoveryTokenDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
