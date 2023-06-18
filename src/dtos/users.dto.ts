import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @IsString()
  readonly role: string = 'user';
}

export class UpdateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly password?: string;
  readonly role?: string;
}
