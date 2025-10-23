import axios from 'axios'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs'
import path from 'path'
import { Readable } from 'stream'

import { CONST } from '@/constants'
import { FILE_MANAGER } from '@/constants/fileManager.const'
import s3Client, { IS3Service } from '@/utils/s3Client'
import { utils } from '@/utils/utils'

import { ErrorHandlingService } from './ErrorHandling.service'

class FileManagerService {
  private s3Client: IS3Service
  private basePath: string
  private rootPath: string
  public productionEnv = process.env.NEXT_PUBLIC_FILE_STORAGE_ENVIONMENT === 'production'

  constructor() {
    this.s3Client = s3Client
    this.rootPath = this.productionEnv ? process.env.S3_CDN_ENDPOINT ?? '' : CONST.APP_CONST.CONFIG.STORAGE_PATH
    this.basePath = this.rootPath
  }

  private getFolderPath(type: keyof typeof FILE_MANAGER.FOLDERS): string {
    const folder = FILE_MANAGER.FOLDERS[type]
    if (!folder) {
      throw ErrorHandlingService.badRequest({
        message: `Unknown type: ${type}`
      })
    }
    return `${this.basePath}/${folder}`
  }

  private ensureDirectoryExists(dir: string): void {
    if (!this.productionEnv) {
      if (!existsSync(dir)) {
        try {
          mkdirSync(dir, { recursive: true })
        } catch (error) {
          throw ErrorHandlingService.badRequest({
            message: `Failed to create directory: ${dir}`,
            data: { error: utils.error.getMessage(error) }
          })
        }
      }
    }
  }

  private getFilePath(type: keyof typeof FILE_MANAGER.FOLDERS, fileName: string): string {
    const folderPath = this.getFolderPath(type)
    return `${folderPath}/${fileName}`
  }

  public async writeFile(
    type: keyof typeof FILE_MANAGER.FOLDERS,
    fileName: string,
    data: string | Buffer | Uint8Array,
    fileType: File['type']
  ): Promise<{ status: boolean; message: string | null; data: { filePath: string; fullFilePath: string } }> {
    try {
      const filePath = this.getFilePath(type, fileName)
      const filePathRelative = filePath.replace(this.rootPath, '')

      if (this.productionEnv) {
        await this.s3Client.uploadFile({
          key: filePathRelative,
          contentType: fileType,
          body: data,
          accessType: FILE_MANAGER.FOLDER_ACCESS[type]
        })
      } else {
        const dir = path.dirname(filePath)
        this.ensureDirectoryExists(dir)
        writeFileSync(filePath, data)
      }

      return utils.generateRes({
        status: true,
        message: 'File written successfully',
        data: { filePath: filePathRelative, fullFilePath: filePath }
      })
    } catch (error) {
      throw ErrorHandlingService.badRequest({
        message: `Failed to write file: ${fileName}`,
        data: { error: utils.error.getMessage(error) }
      })
    }
  }

  public resolveFileName(fileName: string) {
    return fileName.startsWith('/') ? fileName.replace('/', '') : fileName
  }

  public async readFile(
    type: keyof typeof FILE_MANAGER.FOLDERS,
    fileName_: string,
    _?: BufferEncoding
  ): Promise<{ status: boolean; message: string | null; data: { data: Buffer | Readable; filePath: string } }> {
    let fileName = fileName_

    try {
      const fileNameSplit = fileName_.split('/')
      const fileName = fileNameSplit[fileNameSplit.length - 1]
      const filePath = this.getFilePath(type, fileName)

      const filePathRelative = filePath.replace(this.rootPath, '')

      const data = this.productionEnv
        ? await this.s3Client.getFile({ key: filePathRelative })
        : await axios({
          method: 'get',
          url: filePath
        })

      return utils.generateRes({
        status: true,
        message: 'File read successfully',
        data: { data, filePath: filePathRelative, fullFilePath: filePath }
      })
    } catch (error) {
      throw ErrorHandlingService.notFound({
        message: `Failed to read file: ${fileName}`,
        data: { error: utils.error.getMessage(error) }
      })
    }
  }

  public async readFileAsString(
    type: keyof typeof FILE_MANAGER.FOLDERS,
    fileName: string
  ): Promise<{ status: boolean; message: string | null; data: { data: string; filePath: string } }> {
    try {
      const {
        data: { data, filePath }
      } = await this.readFile(type, fileName)
      return utils.generateRes({
        status: true,
        message: 'File read as string successfully',
        data: { data: data.toString('utf8'), filePath }
      })
    } catch (error) {
      throw ErrorHandlingService.notFound({
        message: `Failed to read file as string: ${fileName}`,
        data: { error: utils.error.getMessage(error) }
      })
    }
  }

  public async deleteFile(
    type: keyof typeof FILE_MANAGER.FOLDERS,
    fileName: string
  ): Promise<{ status: boolean; message: string | null; data: { filePath: string } }> {
    try {
      // Extract just the file name if a full path is provided
      fileName = path.basename(fileName)

      const filePath = this.getFilePath(type, fileName)

      if (existsSync(filePath) || this.productionEnv) {
        const filePathRelative = filePath.replace(this.rootPath, '')

        if (!this.productionEnv) {
          unlinkSync(filePath)
        } else {
          await this.s3Client.deleteFile({
            key: filePathRelative
          })
        }

        return utils.generateRes({
          status: true,
          message: 'File deleted successfully',
          data: { filePath: filePathRelative }
        })
      } else {
        throw ErrorHandlingService.notFound({
          message: `File not found: ${fileName}`
        })
      }
    } catch (error) {
      throw ErrorHandlingService.notFound({
        message: `Failed to delete file: ${fileName}`,
        data: { error: utils.error.getMessage(error) }
      })
    }
  }
}

export { FileManagerService }
