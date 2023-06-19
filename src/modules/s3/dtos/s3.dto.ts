import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';

export class RenameFileDto {
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;
  @IsNotEmpty()
  @IsString()
  readonly newFileName: string;
}

export class UploadedFileByUrlDto {
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;
  @IsNotEmpty()
  @IsUrl()
  readonly url: string;
}