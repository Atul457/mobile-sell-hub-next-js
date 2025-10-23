import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'stream'

import { string } from './string'

export interface IS3Service {
  uploadFile(args: {
    key: string
    body: Buffer | Readable | string | Uint8Array
    contentType: string
    accessType: ObjectCannedACL
  }): Promise<string>
  getFile(args: { key: string }): Promise<Readable | null>
  getPresignedUrl(args: { key: string; expiresIn?: number }): Promise<string>
  listFiles(args: { prefix: string }): Promise<string[]>
  deleteFile(args: { key: string }): Promise<void>
}

class S3Service implements IS3Service {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.S3_SECRET ?? ''
      }
    })
    this.bucketName = process.env.S3_BUCKET_NAME ?? ''
  }

  getKey(key: string) {
    return string.removeLeadingSlash(key)
  }

  async uploadFile(args: Parameters<IS3Service['uploadFile']>[0]): Promise<string> {
    const { key, body, contentType, accessType } = args
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.getKey(key),
      Body: body,
      ACL: accessType,
      ContentType: contentType
    })

    await this.s3Client.send(command)
    return key
  }

  async getFile({ key }: { key: string }): Promise<Readable | null> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.getKey(key)
    })

    try {
      const response = await this.s3Client.send(command)
      return response.Body as Readable
    } catch (error) {
      console.error('Error getting file:', error)
      return null
    }
  }

  async getPresignedUrl({ key, expiresIn = 3600 }: { key: string; expiresIn?: number }): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.getKey(key)
    })
    return await getSignedUrl(this.s3Client, command, { expiresIn })
  }

  async listFiles({ prefix }: { prefix: string }): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix
    })

    const { Contents } = await this.s3Client.send(command)
    return Contents?.map(file => file.Key || '') ?? []
  }

  async deleteFile({ key }: { key: string }): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: this.getKey(key)
    })

    await this.s3Client.send(command)
  }
}

export default new S3Service()
