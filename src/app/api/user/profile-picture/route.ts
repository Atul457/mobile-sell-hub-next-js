import { dbConfig } from '@/configs/dbConfig'
import UserModel, { IUser } from '@/models/user.model'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { FileManagerService } from '@/services/FileManager.service'
import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function PUT(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const us = services.server.UserService
    const authData = await middlewares.withUser(request, {
      select: ['profilePicture']
    })
    const userId = authData.userId
    const formData = await utils.getReqBody(request, { formData: true })
    const body = utils.formData.formDataToJson({ formData: formData as FormData })

    const fvs = services.FileValidatorService
    const fs = services.server.FileService

    const file = body.file ?? (null as File | null)
    const removeFile = body.remove

    if (!removeFile) {
      const validatorResponse = await fvs.validateFileData(body, {
        multiple: false,
        validFileTypes: utils.CONST.USER.VALID_PROFILE_PICTURE_TYPES
      })

      if (!validatorResponse.status) {
        throw ErrorHandlingService.badRequest({
          message: validatorResponse.message!
        })
      }
    }

    const fm = new FileManagerService()

    if (authData.profilePicture) {
      try {
        fm.deleteFile('profile-pictures', authData.profilePicture)
        fs.deleteFileByPath(authData.profilePicture)
      } catch (error) {
        console.error({ error })
      }
    }

    let user: IUser | null = null

    if (removeFile) {
      user = await us.updateUser(userId, {
        profilePicture: null
      })
    } else {
      const profileBuffer = await utils.file.fileToBuffer(file)
      const newFileName = utils.file.generateUniqueFileName(file)

      const {
        data: { filePath: thumbnailStoragePath }
      } = await fm.writeFile('profile-pictures', newFileName, profileBuffer, file.type)

      await fs.createFile({
        type: 'profile-pictures',
        userId: authData.id,
        originalName: file.name,
        fileName: newFileName,
        filePath: thumbnailStoragePath,
        fileType: file.type,
        size: file.size
      })

      user = await us.updateUser(userId, {
        profilePicture: thumbnailStoragePath
      })
    }

    const commonKeysValues = utils.helpers.user.getUserDetails(user ?? new UserModel())

    const { _REMOVED_SUCCESSFULLY, _UPDATED_SUCCESSFULLY } = utils.CONST.RESPONSE_MESSAGES

    return Response.json(
      utils.generateRes({
        status: true,
        data: commonKeysValues,
        message: (removeFile ? _REMOVED_SUCCESSFULLY : _UPDATED_SUCCESSFULLY).replace('[ITEM]', 'Profile picture')
      })
    )
  })
}
