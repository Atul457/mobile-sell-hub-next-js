import { PipelineStage } from 'mongoose'
import { Schema } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import ReportModel from '@/models/report.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { mongo } from '@/utils/mongo'
import { serverHelpers } from '@/utils/serverHelpers'
import { utils } from '@/utils/utils'

export async function GET(request: NextRequest) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.REPORT,
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
      userId = null,
      profileId = null
    } = await serverSchemas.reportsPaginationSchema.validate({
      ...(body ?? {})
    })

    let userIds: Schema.Types.ObjectId[] = []
    let userId_ = userId ? mongo.stringToObjectId(userId) : null
    let profileId_ = profileId ? mongo.stringToObjectId(profileId) : null

    if (userId) {
      const getRelatedUserIdsResponse = await serverHelpers.user.getRelatedUserIds({
        loggedInUserId: userId_
      })
      userIds = getRelatedUserIdsResponse.userIds
    }

    const queryStage: PipelineStage[] = [
      {
        $match: {
          ...(query && {
            $and: query.split(' ').map(word => ({
              $or: [
                { identifier: { $regex: new RegExp(word, 'gi') } },
                { 'qr.qrCode': { $regex: new RegExp(word, 'gi') } },
                { 'profile.firstName': { $regex: new RegExp(word, 'gi') } },
                { 'profile.lastName': { $regex: new RegExp(word, 'gi') } },
                { 'profile.email': { $regex: new RegExp(word, 'gi') } },
                { 'user.firstName': { $regex: new RegExp(word, 'gi') } },
                { 'user.lastName': { $regex: new RegExp(word, 'gi') } },
                { 'user.email': { $regex: new RegExp(word, 'gi') } }
              ]
            }))
          })
        }
      }
    ]

    const stages: PipelineStage[] = [
      {
        $match: {
          ...(userId_ && {
            userId: {
              $in: userIds
            }
          }),
          ...({
            status: { $ne: utils.CONST.REPORT.STATUS.DELETED }
          }),
          ...(status !== -1 && { status }),
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
                email: 1
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
      ...profileId_ ? [{
        $match: {
          "profile._id": profileId_
        }
      }] : [],
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
                profilePicture: 1,
                role: 1
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
                usedAt: 1
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
          from: 'transactions',
          localField: 'transactionId',
          foreignField: '_id',
          as: 'transaction',
          pipeline: [
            {
              $project: {
                transactionId: 1,
                amount: 1,
                status: 1,
                amountPaid: 1
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
      },

      ...queryStage
    ]

    const totalCount_ = await ReportModel.aggregate([
      ...stages,
      { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const reports = await ReportModel.aggregate([
      ...stages,
      {
        $addFields: {
          id: '$_id'
        }
      }
    ])
      .sort({
        [sort]: order
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        __v: 0
      })

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          page,
          limit,
          query,
          totalCount,
          reports
        }
      })
    )
  })
}
