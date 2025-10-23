import { PipelineStage } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import RolePermissionModel from '@/models/rolePermission.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function GET(request: NextRequest) {
  return utils.errorHandler(async function () {
    await dbConfig()

    await middlewares.withUser(request)

    const body = utils.searchParamsToJson({
      params: request.nextUrl.searchParams
    })

    const {
      page = 1,
      limit = 10,
      query = null,
      sort = 'createdAt',
      order = 'desc',
      type
    } = await serverSchemas.rolesPaginationSchema.validate({
      ...(body ?? {})
    })

    const stages: PipelineStage[] = [
      {
        $match: {
          type: type ?? { $ne: null }
        }
      }
    ]

    const totalCount_ = await RolePermissionModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const reports = await RolePermissionModel.aggregate([
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
        __v: 0,
        addOnsCount: 0,
        totalTestsCount: 0,
        testsIncluded: 0,
        addOnsIncluded: 0
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

export async function POST(request: Request) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    // Authenticate the user with admin privileges
    await middlewares.withUser(request)

    // Get the request body
    // const body = await utils.getReqBody(request)

    // Validate the request body
    // const validatedData = await commonSchemas.addUpdateRolePermission.validate(body ?? {})

    // Create or update the role permission
    // const [rolePermission, isNew] = await rps.createOrUpdateRolePermission(role as IRolePermission['roleId'], module, {
    //     // role: role as IRolePermission['role'],
    //     module,
    //     actions
    // })

    // Generate the response message
    // const message = isNew
    //     ? utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Role Permission')
    //     : utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Role Permission')

    return Response.json(
      utils.generateRes({
        status: true,
        // message: message,
        data: {
          // rolePermission
        }
      })
    )
  })
}
