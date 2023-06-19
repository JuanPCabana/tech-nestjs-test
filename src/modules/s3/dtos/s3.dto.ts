import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RenameFileDto {
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;
  @IsNotEmpty()
  @IsString()
  readonly newFileName: string;
}
