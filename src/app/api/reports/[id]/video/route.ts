import mongoose from 'mongoose'

import { IRequestArgs } from '@/app/api/types'
// import { dbConfig } from '@/configs/dbConfig'
import ReportModel from '@/models/report.model'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
// import { FileManagerService } from '@/services/FileManager.service'
// import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import s3Client from '@/utils/s3Client'
import { utils } from '@/utils/utils'

export async function GET(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.REPORT,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
    })
    await av.validate()

    const reportId = new mongoose.Types.ObjectId(args.params.id)

    const existingReport = await ReportModel.findOne({
      _id: reportId
    }).select('videoUrl')

    if (!existingReport) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Report')
      })
    }

    let url: string | null = null

    if (existingReport.videoUrl) {
      url = await s3Client.getPresignedUrl({
        key: existingReport.videoUrl
      })
    }

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          url
        }
      })
    )
  })
}
