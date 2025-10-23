import mongoose, { PipelineStage } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import ProfileModel, { IProfile } from '@/models/profile.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { serverSchemas } from '@/schemas/server.schemas'
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
      module: utils.CONST.ROLE_PERMISSION.MODULES.PROFILE,
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
      userId = null
    } = await serverSchemas.profilesPaginationSchema.validate({
      ...(body ?? {})
    })

    const showLoggedInUserAtTop = false
    const userId_ = userId ? new mongoose.Types.ObjectId(userId) : null

    const stages: PipelineStage[] = [
      ...(userId_
        ? [
          {
            $match: {
              $or: [
                {
                  creatorId: userId_
                },
                {
                  userId: userId_
                }
              ]
            }
          }
        ]
        : []),
      {
        $match: {
          ...(query && {
            $and: query.split(' ').map(word => ({
              $or: [
                { firstName: { $regex: new RegExp(word, 'gi') } },
                { lastName: { $regex: new RegExp(word, 'gi') } },
                { pid: { $regex: new RegExp(word, 'g') } },
                { email: { $regex: new RegExp(word, 'gi') } },
                { phoneNumber: { $regex: new RegExp(word, 'gi') } }
              ]
            }))
          })
        }
      },
      ...(showLoggedInUserAtTop
        ? [
          {
            $addFields: {
              isLoggedInUser: {
                $cond: {
                  if: {
                    $or: [{ $eq: ['$userId', userId_] }]
                  },
                  then: 1,
                  else: 0
                }
              }
            }
          }
        ]
        : [])
    ]

    const totalCount_ = await ProfileModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const profiles = await ProfileModel.aggregate([
      ...stages,
      {
        $addFields: {
          id: '$_id'
        }
      }
    ])
      .sort({
        ...(showLoggedInUserAtTop
          ? {
            isLoggedInUser: -1
          }
          : {}),
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
          profiles
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
      module: utils.CONST.ROLE_PERMISSION.MODULES.PROFILE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
    })

    await av.validate()
    const body = await utils.getReqBody(request)
    const validatedData = await commonSchemas.addProfile.validate(body ?? {})

    const { firstName, lastName, email, phoneNumber, dob, gender } = validatedData

    const ps = services.server.ProfileService

    const pid = await ps.generatePid()

    const profile = await ps.createProfile({
      firstName,
      lastName,
      pid,
      dob: dob ?? undefined,
      email: email ?? undefined,
      phoneNumber: !phoneNumber?.trim?.() ? undefined : phoneNumber,
      gender: gender ? (gender as IProfile['gender']) : undefined,
      creatorId: authData.userId
    })

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Profile'),
        data: {
          profile
        }
      })
    )
  })
}
