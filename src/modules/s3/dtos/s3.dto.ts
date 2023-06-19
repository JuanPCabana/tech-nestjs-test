import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';

export class BaseClass { }

export class RenameFileDto extends PartialType(BaseClass) {
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;
  @IsNotEmpty()
  @IsString()
  readonly newFileName: string;
}

export class UploadedFileByUrlDto extends PartialType(BaseClass) {
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ description:'Img url'})
  readonly url: string;
}

export class UploadFileDto extends PartialType(BaseClass) {
  @IsNotEmpty()
  @ApiProperty({ description:'File name'})
  originalname: string;

  @IsNotEmpty()
  @ApiProperty({ description:'File buffer' })
  buffer: Buffer;
}