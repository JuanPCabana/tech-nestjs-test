import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import getObjectOutputToBuffer from 'src/helpers/fileBuffer.helper';
import responseHandler from 'src/helpers/response.helper';
import * as AWS from 'aws-sdk';
import { RenameFileDto, UploadedFileByUrlDto } from '../dtos/s3.dto';
import { async } from 'rxjs';
import axios from 'axios';
import getImageFormat from 'src/helpers/getImageFormat.helper';
import * as mime from 'mime-types';


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

  async uploadFile(res: Response, fileName: string, file: Buffer) {
    const params = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: fileName,
      Body: file,
      ContentType: `image/${fileName.split('.')[1]}`
    }
    try {
      const command = new PutObjectCommand(params);
      const data = await this.s3Client.send(command);
      return responseHandler.handleResponse(res, {}, 'Archivo cargado correctamente!',  201)
    } catch (error) {
      console.log(error);
      return responseHandler.handleErrorResponse(res, 500, 'Error inesperado!')
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
      return res.send(responseHandler.handleErrorResponse(res, 400, 'El archivo no existe o no esta disponible!'))
    }
  }

  async renameFile(res:Response, body: RenameFileDto) {
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
      return responseHandler.handleErrorResponse(res, 400, 'Ocurrio un error intentando renombrar un archivo, verifique que el nombre sea el correcto!')
    }

    return responseHandler.handleResponse(res, {}, 'Archivo renombrado correctamente!')
  }

  async getObjectUrl(res: Response, fileName: string) {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: fileName,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      if (data && data.Body) {
        const url = `https://${this.configService.getOrThrow('BUCKET_NAME')}.s3.amazonaws.com/${fileName}`;
        return responseHandler.handleResponse(res, { url }, 'Url del archivo obtenida correctamente!');
      } else {
        throw new Error('No se pudo obtener el objeto de S3');
      }
    } catch (error) {
      return responseHandler.handleErrorResponse(res, 400, 'No se pudo obtener el objeto de S3!')
    }
  }

  async listObjects(res: Response) {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      if (data && data.Contents) {
        return responseHandler.handleResponse(res, { docs: data.Contents });
      } else {
        throw new Error('No se pudieron listar los objetos de S3');
      }
    } catch (error) {
      return responseHandler.handleErrorResponse(res, 400, 'No se pudo obtener los objetos de S3!')
    }
  }

  async uploadFileByUrl(res: Response, fileInfo: UploadedFileByUrlDto) {
    const { fileName, url } = fileInfo;

    const image = await axios.get(url, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(image.data, 'binary');
    const imageFormat = mime.extension(image.headers['content-type']);
    if (!imageFormat) {
      responseHandler.handleErrorResponse(res, 400, 'Url Invalida!')
    }

    return await this.uploadFile(res, `${fileName}.${imageFormat}`, imageBuffer)

  }

}