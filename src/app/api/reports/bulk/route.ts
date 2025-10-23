import { dbConfig } from '@/configs/dbConfig'
import QrModel from '@/models/qr.model'
import { IReport } from '@/models/report.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

const { STATUS } = utils.CONST.REPORT

export async function PATCH(request: Request) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.REPORT,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
    })
    await av.validate()

    let duplicateQrsCount = 0

    const ms = services.server.MailService
    const rs = services.server.ReportService

    const body = await utils.getReqBody(request)
    const validatedData = await commonSchemas.generateReportQr.validate({
      ...(body ?? {})
    })

    const { count, qrs } = validatedData

    await utils.loops.asyncWhileLoop({
      loopCount: qrs.length,
      functionToFire: async index => {
        const qr = qrs[index]
        const qr_ = await QrModel.aggregate([
          {
            $match: {
              qrCode: qr.qrCode
            }
          },
          {
            $lookup: {
              from: 'reports',
              localField: 'reportId',
              foreignField: '_id',
              as: 'report',
              pipeline: [
                {
                  $match: {
                    status: { $in: [STATUS.PENDING, STATUS.SUBMITTED, STATUS.REJECTED] }
                  }
                }
              ]
            }
          },
          {
            $unwind: '$report'
          }
        ])

        if (!qr_.length) {
          duplicateQrsCount++
        } else {
          const reportId = qr_[0].report._id as string
          const report = await rs.updateReportStatus(reportId, qr.status as IReport['status'], {
            rejectionReason: qr.reason
          })
          if (report && [STATUS.REJECTED, STATUS.SUBMITTED].includes(report.status)) {
            await ms.createMail({
              type: report.status === STATUS.REJECTED ? 'report-rejection' : 'report-receive',
              userId: report.userId,
              data: JSON.stringify({
                reportId: report._id
              })
            })
          }
        }
      }
    })

    const { _UPDATED_SUCCESSFULLY, NO_REPORTS_UPDATED, _SKIPPED_N_WITHOUT_REASON } = utils.CONST.RESPONSE_MESSAGES

    let message = _UPDATED_SUCCESSFULLY

    if (duplicateQrsCount || !qrs.length) {
      const updatedCount = count - duplicateQrsCount

      if (!updatedCount || !qrs.length) {
        throw ErrorHandlingService.conflict({
          message: NO_REPORTS_UPDATED
        })
      }

      message = _UPDATED_SUCCESSFULLY.replace('[ITEM]', `${updatedCount} Report${updatedCount > 1 ? 's' : ''}`)

      if (duplicateQrsCount) {
        message += `, ${_SKIPPED_N_WITHOUT_REASON}`
          .replace('[N]', duplicateQrsCount.toString())
          .replace('[ITEM]', `Invalid Report${duplicateQrsCount > 1 ? 's' : ''}`)
      }
    } else {
      message = message.replace('[ITEM]', `Report${count > 1 ? 's' : ''}`)
    }

    return Response.json(
      utils.generateRes({
        status: true,
        message
      })
    )
  })
}
