import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { promisify } from 'util';
import { Buffer } from 'buffer';

export default async function getObjectOutputToBuffer(output: GetObjectCommandOutput): Promise<Buffer> {
  const stream = output.Body as Readable;
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on('error', (error: Error) => {
      reject(error);
    });
  });
}