import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import getObjectOutputToBuffer from 'src/helpers/fileBuffer.helper';
import responseHandler from 'src/helpers/response.helper';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  })
  constructor(
    private readonly configService: ConfigService
  ) { }

  async uploadFile(fileName: string, file: Buffer) {
    const params = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: fileName,
      Body: file
    }
    try {
      const command = new PutObjectCommand(params);
      const data = await this.s3Client.send(command);
      return responseHandler.handleResponse({}, 'Archivo cargado correctamente!')
    } catch (error) {
      console.log(error);
      return responseHandler.handleErrorResponse(500, 'Error inesperado!')
    }
  }

  async downloadFile(res: Response, fileName: string) {
    const params = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: fileName,
    }
    try {
      const command = new GetObjectCommand(params);
      const response = await this.s3Client.send(command);
      const buffer = await getObjectOutputToBuffer(response);

      res.setHeader('Content-Type', response.ContentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer)

    }
    catch (err) {
      console.log(err)
    }
  }
}