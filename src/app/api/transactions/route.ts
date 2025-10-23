import { PipelineStage, Schema } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import TransactionModel from '@/models/transaction.model'
import UserModel from '@/models/user.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
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
      module: utils.CONST.ROLE_PERMISSION.MODULES.TRANSACTION,
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
      status = '-1',
      userId = null
    } = await serverSchemas.transactionsPaginationSchema.validate({
      ...(body ?? {})
    })

    let havePermissionToRead = false
    let userIds: Schema.Types.ObjectId[] = []
    let userId_ = userId ? mongo.stringToObjectId(userId) : null

    if (userId_) {
      let user = await UserModel.findById(userId_).select(['type', 'role'])

      if (!user) {
        throw ErrorHandlingService.notFound({
          message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'User')
        })
      }

      if (utils.helpers.user.checkIsOrganiation(user.type)) {
        const av = new ActionValidator({
          roleId: authData.roleId ?? null,
          module: utils.CONST.ROLE_PERMISSION.MODULES.TRANSACTION,
          action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ,
          throw: false
        })

        const havePermissionToRead_ = await av.validate()
        havePermissionToRead = Boolean(havePermissionToRead_)

        if (havePermissionToRead) {
          const getRelatedUserIdsResponse = await serverHelpers.user.getRelatedUserIds({
            loggedInUserId: userId_,
            user
          })

          user = getRelatedUserIdsResponse.user
          userIds = getRelatedUserIdsResponse.userIds
        }
      } else {
        userIds = [userId_ as unknown as Schema.Types.ObjectId]
      }
    }

    const stages: PipelineStage[] = [
      {
        $match: {
          ...(status !== '-1' && { status })
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
                email: 1,
                firstName: 1,
                lastName: 1,
                profilePicture: 1,
                type: 1,
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
      ...(userId_
        ? [
          {
            $match: {
              userId: { $in: userIds }
            }
          }
        ]
        : []),
      {
        $match: {
          ...(query && {
            $and: query.split(' ').map(word => ({
              $or: [
                { 'user.firstName': { $regex: new RegExp(word, 'gi') } },
                { 'user.lastName': { $regex: new RegExp(word, 'gi') } },
                { transactionId: { $regex: new RegExp(word, 'g') } }
              ]
            }))
          })
        }
      },
      ...(userId_
        ? [
          {
            $addFields: {
              isMe: {
                $cond: {
                  if: { $eq: ['$userId', userId_] },
                  then: true,
                  else: false
                }
              }
            }
          }
        ]
        : [])
    ]

    const totalCount_ = await TransactionModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const transactions = await TransactionModel.aggregate([
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
          transactions
        }
      })
    )
  })
}
