import { PipelineStage } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import PackageModel from '@/models/package.model'
import QrModel from '@/models/qr.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function GET(request: NextRequest) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.QR,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
    })

    await av.validate()

    const body = utils.searchParamsToJson({
      params: request.nextUrl.searchParams
    })

    const {
      page = 1,
      limit = 10,
      query = null,
      sort = 'createdAt',
      order = 'desc',
      status = -1,
      all = false
    } = await serverSchemas.qrsPaginationSchema.validate({
      ...(body ?? {})
    })

    const stages: PipelineStage[] = [
      {
        $match: {
          ...(query && {
            qrCode: { $regex: new RegExp(query, 'g') }
          }),
          status: status === -1 ? { $ne: utils.CONST.QR.STATUS.DELETED } : status
        }
      }
    ]

    const totalCount_ = await QrModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    let qrs: any[] = []

    const qrs_ = QrModel.aggregate([
      ...stages,
      {
        $lookup: {
          localField: 'usedBy',
          from: 'users',
          foreignField: '_id',
          as: 'usedBy',
          pipeline: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                profilePicture: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$usedBy',
          preserveNullAndEmptyArrays: true
        }
      },
      ...(!all
        ? [
          {
            $addFields: {
              id: '$_id'
            }
          }
        ]
        : [])
    ]).sort({
      [sort]: order
    })

    if (!all) {
      qrs = await qrs_
        .skip((page - 1) * limit)
        .limit(limit)
        .project({
          __v: 0,
          packageId: 0
        })
    } else {
      qrs = await qrs_.project({
        __v: 0,
        packageId: 0,
        reportId: 0
      })
    }

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          page,
          limit,
          query,
          status,
          totalCount,
          qrs
        }
      })
    )
  })
}

export async function POST(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.QR,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
    })

    await av.validate()

    const body = await utils.getReqBody(request)
    const validatedData = await commonSchemas.generateQr.validate(body ?? {})

    const { count, qrs = [] } = validatedData

    let qrCode: string | undefined

    const qrs_ = qrs ?? []
    let duplicateQrsCount = 0

    const qs = services.server.QrService

    const package_ = await PackageModel.findOne({
      status: utils.CONST.PACKAGE.STATUS.ACTIVE,
      isDefault: utils.CONST.APP_CONST.BOOLEAN_STATUS.YES
    })
      .sort({ createdAt: 1 })
      .limit(1)

    if (!package_) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Package')
      })
    }

    for (let i = 0; i < count; i++) {
      qrCode = qrs_[i]
      const [qrCode_, isUnique] = await qs.generateQr(qrCode)
      qrCode = qrCode_
      if (qrs_[i] && !isUnique) {
        duplicateQrsCount++
      } else {
        await qs.createQr({
          qrCode,
          packageId: package_.id
        })
      }
    }

    const { _ADDED_SUCCESSFULLY, _SKIPPED_N } = utils.CONST.RESPONSE_MESSAGES

    let message = _ADDED_SUCCESSFULLY

    if (duplicateQrsCount || qrs_.length) {
      const addedCount = count - duplicateQrsCount

      if (!addedCount) {
        throw ErrorHandlingService.conflict({
          message: _SKIPPED_N
            .replace('[N]', duplicateQrsCount.toString())
            .replace('[ITEM]', 'Qr code')
            .replace('[REASON]', 'already exists')
        })
      }

      message = _ADDED_SUCCESSFULLY.replace('[ITEM]', `${addedCount} Qr code${addedCount > 1 ? 's' : ''}`)
      if (duplicateQrsCount) {
        message += `, ${_SKIPPED_N}`
          .replace('[N]', duplicateQrsCount.toString())
          .replace('[ITEM]', `Qr code${duplicateQrsCount > 1 ? 's' : ''}`)
          .replace('[REASON]', 'already exists')
      }
    } else {
      message = message.replace('[ITEM]', `Qr code${count > 1 ? 's' : ''}`)
    }

    return Response.json(
      utils.generateRes({
        status: true,
        message
      })
    )
  })
}
