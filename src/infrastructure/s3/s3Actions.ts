import { Upload } from "@aws-sdk/lib-storage";
import s3 from "./s3Config";
import crypto from 'crypto';
import mime from 'mime-types';
import config from "../config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function uploadFileToS3(fileBuffer: Buffer | { type: 'Buffer', data: number[] }, originalname: string): Promise<string> {

    const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer.data);

    const imageName = randomImageName();

    const extension = originalname.split('.').pop() || '';
    const contentType = mime.lookup(extension) || 'application/octet-stream';

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: config.bucketName,
            Key: imageName,
            Body: buffer,
            ContentType: contentType,
        }
    });

    try {
        await upload.done();

        const command = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: imageName,
        });

        const signedUrl = await getSignedUrl(s3, command);

        return signedUrl;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
}

export async function fetchFileFromS3(key: string): Promise<string> {
    try {

        const command = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: key,
        });
        const url = await getSignedUrl(s3, command);

        return url;
    } catch (error) {
        console.error("Error fetching file from S3:", error);
        throw error;
    }
}