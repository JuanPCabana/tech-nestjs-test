import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsMongoId, IsOptional, } from 'class-validator';
import { Types } from 'mongoose';

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
  @ApiProperty({ description: 'user Role (optional)' })
  readonly role?: string = 'user';
}

export class UpdateUserDto extends PartialType(BaseClass) {
  @IsString()
  @IsOptional()
  readonly firstName?: string;
  @IsString()
  @IsOptional()
  readonly lastName?: string;
  @IsEmail()
  @IsOptional()
  readonly email?: string;
  @IsString()
  @IsOptional()
  readonly password?: string;
  @IsString()
  @IsOptional()
  readonly role?: string;
}
