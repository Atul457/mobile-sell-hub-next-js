import mongoose from 'mongoose'
import { HL7Message } from 'simple-hl7'

import { dbConfig } from '@/configs/dbConfig'
import { IChainOfCustody } from '@/models/custody.model'
import ReportModel, { IReport, IReportPopulated } from '@/models/report.model'
// import UserModel from '@/models/user.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import ReportService from '@/services/server/Report.service'
import { middlewares } from '@/utils/middlewares'
import { mongo } from '@/utils/mongo'
import { serverHelpers } from '@/utils/serverHelpers'
import { utils } from '@/utils/utils'

import { IRequestArgs } from '../../types'

const { STATUS } = utils.CONST.REPORT

export async function GET(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.REPORT,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
    })
    await av.validate()

    await serverSchemas.objectIdSchema.required().validate(args.params.id)

    const reportId = new mongoose.Types.ObjectId(args.params.id)

    const reports = await ReportModel.aggregate([
      {
        $match: {
          _id: reportId
        }
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profileId',
          foreignField: '_id',
          as: 'profile',
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                gender: 1,
                age: 1,
                phoneNumber: 1,
                dob: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
                profilePicture: 1,
                phoneNumber: 1,
                type: 1,
                organizationName: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $lookup: {
          from: 'qrs',
          localField: 'qrId',
          foreignField: '_id',
          as: 'qr',
          pipeline: [
            {
              $project: {
                qrCode: 1,
                usedAt: 1,
                packageId: 1
              }
            },
            {
              $lookup: {
                from: 'packages',
                localField: 'packageId',
                foreignField: '_id',
                as: 'package',
                pipeline: [
                  {
                    $project: {
                      withChainOfCustody: 1,
                      name: 1,
                      price: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: '$package',
                preserveNullAndEmptyArrays: true
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$qr',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'videoUrl',
          foreignField: 'filePath',
          as: 'video',
          pipeline: [
            {
              $project: {
                updatedAt: 0,
                __v: 0
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$video',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'processedReportUrl',
          foreignField: 'filePath',
          as: 'processedReport',
          pipeline: [
            {
              $project: {
                updatedAt: 0,
                __v: 0
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$processedReport',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'reportUrl',
          foreignField: 'filePath',
          as: 'report',
          pipeline: [
            {
              $project: {
                filePath: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$report',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'transactions',
          localField: 'transactionId',
          foreignField: '_id',
          as: 'transaction',
          pipeline: [
            {
              $project: {
                createdAt: 0,
                __v: 0,
                updatedAt: 0,
                userId: 0,
                cardId: 0,
                status: 0
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$transaction',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).project({
      updatedAt: 0,
      __v: 0
    })

    if (!reports.length) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Report')
      })
    }

    const chainOfCustodyAdded = await serverHelpers.report.chainOfCustodyAdded(args.params.id)
    let chainOfCustodies: IChainOfCustody[] = []

    if (chainOfCustodyAdded) {
      const { data } = await serverHelpers.report.listChainOfCustody(args.params.id)
      chainOfCustodies = data.chainOfCustodies
    }

    const report = reports[0] as IReportPopulated

    let hl7Message: HL7Message | null = null

    if (report.processedReport && report.status === utils.CONST.REPORT.STATUS.CHECKED) {
      try {
        const file = report.processedReport
        let content = await serverHelpers.report.readHl7FileContent(file.type, file.fileName)
        if (content) {
          hl7Message = serverHelpers.report.parseHL7Content(content)
        }
      } catch (error) {
        console.error(utils.error.getMessage(error))
      }
    }

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          report: {
            ...report,
            chainOfCustodyAdded,
            chainOfCustodies,
            hl7Message
          }
        }
      })
    )
  })
}

export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
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
    const body = await utils.getReqBody(request)
    const validatedData = await serverSchemas.updateReportStatus.validate({
      ...(body ?? {}),
      _id: args.params.id
    })

    const { status, _id, rejectionReason } = validatedData

    await serverSchemas.objectIdSchema.required().validate(_id)

    const rs = ReportService
    const ms = services.server.MailService
    const report = await ReportModel.findById(_id).select('_id userId')

    if (!report) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Report')
      })
    }

    if (report.status === STATUS.DRAFT) {
      throw ErrorHandlingService.forbidden({
        message: utils.CONST.RESPONSE_MESSAGES.DRAFT_REPORT_CANT_UPDATED
      })
    }

    const updatedReport = await rs.updateReportStatus(_id, status as IReport['status'], {
      rejectionReason
    })

    if ([STATUS.REJECTED, STATUS.SUBMITTED].includes(status as IReport['status'])) {
      await ms.createMail({
        type: status === STATUS.REJECTED ? 'report-rejection' : 'report-receive',
        userId: report.userId,
        data: JSON.stringify({
          reportId: report._id
        })
      })
    }

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Report status'),
        data: {
          report: updatedReport
        }
      })
    )
  })
}

export async function DELETE(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    await dbConfig()

    // Validate user permissions
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.REPORT,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.DELETE
    })
    await av.validate()
    let userId = args.params.id
    let userId_ = mongo.stringToObjectId(userId)

    // Soft delete reports related to this user
    await ReportModel.updateOne(
      {
        _id: userId_,
        status: { $ne: utils.CONST.REPORT.STATUS.DELETED }
      },
      {
        $set: { status: utils.CONST.REPORT.STATUS.DELETED }
      }
    )

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Report'),
        data: {
          userId
        }
      })
    )
  })
}
