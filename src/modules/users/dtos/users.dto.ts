import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class BaseClass { }


export class AddUserDto extends PartialType(BaseClass) {
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
  @ApiProperty({ description:'user Role (optional)'})
  readonly role?: string = 'user';
}

export class UpdateUserDto extends PartialType(BaseClass) {
  @IsString()
  readonly firstName?: string;
  @IsString()
  readonly lastName?: string;
  @IsEmail()
  readonly email?: string;
  @IsString()
  readonly password?: string;
  @IsString()
  readonly role?: string;
}
