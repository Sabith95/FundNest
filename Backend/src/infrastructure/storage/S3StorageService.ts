import { injectable } from 'tsyringe';
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from 'crypto';

import { env } from '../config/env';
import { s3Client } from '../config/s3Client';

import { GenerateUploadUrlInput,
        IS3StorageService,
        UploadUrlResponse
 } from './interfaces/IS3StorageService';

@injectable()
 export class S3StorageService implements IS3StorageService {
    private readonly _bucketName = env.AWS_BUCKET_NAME;

    async generateUploadUrl(
        input: GenerateUploadUrlInput
    ): Promise<UploadUrlResponse> {
        const { fileName, contentType, folder } = input;

        const objectKey = `${folder}/${randomUUID()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this._bucketName,
            Key: objectKey,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(
            s3Client,
            command,
            {
                expiresIn: 300,
            }
        );

        return {
            uploadUrl,
            objectKey,
        };
    }

    async generateDownloadUrl(objectKey: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this._bucketName,
            Key: objectKey,
        });

        return getSignedUrl(s3Client, command, {
            expiresIn: 300,
        });
    }

    async deleteFile(objectKey: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this._bucketName,
            Key: objectKey,
        });

        await s3Client.send(command);
    }
}