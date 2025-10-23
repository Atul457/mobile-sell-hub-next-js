import { PipelineStage } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import CategoryModel from '@/models/category.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { services } from '@/services/index.service'
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
      status = -1
    } = await serverSchemas.categoriesPaginationSchema.validate({
      ...(body ?? {})
    })

    const stages: PipelineStage[] = [
      {
        $match: {
          status: { $ne: utils.CONST.CATEGORY.STATUS.DELETED },
          ...(query && {
            name: { $regex: new RegExp(query, 'gi') },
            description: { $regex: new RegExp(query, 'gi') }
          }),
          ...(status !== -1 && { status })
        }
      }
    ]

    const totalCount_ = await CategoryModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const categories = await CategoryModel.aggregate([
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
          categories
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

    const cs = services.server.CategoryService

    // Get the request body
    const body = await utils.getReqBody(request)

    // Validate the request body
    const validatedData = await serverSchemas.addCategory.validate(body ?? {})

    const { name, image, description } = validatedData

    // Create the category
    const category = await cs.createCategory({
      name,
      image,
      description
    })

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Category'),
        data: {
          category
        }
      })
    )
  })
}
