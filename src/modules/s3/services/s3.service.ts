import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import getObjectOutputToBuffer from 'src/helpers/fileBuffer.helper';
import responseHandler from 'src/helpers/response.helper';
import * as AWS from 'aws-sdk';
import { RenameFileDto } from '../dtos/s3.dto';


@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
  })
  private s3: AWS.S3;

  constructor(

    private readonly configService: ConfigService
  ) {
    this.s3 = new AWS.S3({ region: this.configService.getOrThrow('AWS_REGION') });

  }

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
      return res.send(responseHandler.handleErrorResponse(400, 'El archivo no existe o no esta disponible!'))
    }
  }

  async renameFile(body: RenameFileDto) {
    const { fileName, newFileName } = body;
    const params = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      CopySource: `/${this.configService.getOrThrow('BUCKET_NAME')}/${fileName}`,
      Key: newFileName,
    }
    const command = new CopyObjectCommand(params);

    const deleteParams = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: fileName,
    }
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    try {
      await this.s3Client.send(command);
      await this.s3Client.send(deleteCommand);

    } catch (error) {
      return responseHandler.handleErrorResponse(400, 'Ocurrio un error intentando renombrar un archivo, verifique que el nombre sea el correcto!')
    }

    return responseHandler.handleResponse({}, 'Archivo renombrado correctamente!')
  }

  async getObjectUrl(fileName: string) {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: fileName,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      if (data && data.Body) {
        const url = `https://${this.configService.getOrThrow('BUCKET_NAME')}.s3.amazonaws.com/${fileName}`;
        return responseHandler.handleResponse({ url }, 'Url del archivo obtenida correctamente!');
      } else {
        throw new Error('No se pudo obtener el objeto de S3');
      }
    } catch (error) {
      return responseHandler.handleErrorResponse(400, 'No se pudo obtener el objeto de S3!')
    }
  }

  async listObjects() {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      if (data && data.Contents) {
        return responseHandler.handleResponse({ docs: data.Contents });
      } else {
        throw new Error('No se pudieron listar los objetos de S3');
      }
    } catch (error) {
      console.log("🚀 ~ file: s3.service.ts:119 ~ S3Service ~ listObjects ~ error:", error.message, params)
      return responseHandler.handleErrorResponse(400, 'No se pudo obtener los objetos de S3!')
    }
  }

}