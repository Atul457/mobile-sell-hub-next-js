import { IRequestArgs } from '@/app/api/types'
import { dbConfig } from '@/configs/dbConfig'
import CategoryModel from '@/models/category.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    // Authenticate the user with admin privileges
    await middlewares.withUser(request)

    const cs = services.server.CategoryService

    // Get the request body
    const body = await utils.getReqBody(request)

    // Validate the request body
    await serverSchemas.objectIdSchema.required().validate(args.params.id)

    const validatedData = await serverSchemas.addCategory.validate(body ?? {})

    const { name, image, description } = validatedData

    const existingCategory = await CategoryModel.findOne({
      _id: args.params.id,
      status: {
        $ne: utils.CONST.CATEGORY.STATUS.DELETED
      }
    })

    if (!existingCategory) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Category')
      })
    }

    // Update the category
    const category = await cs.updateCategory(args.params.id, {
      name,
      image,
      description
    })

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Category'),
        data: {
          category
        }
      })
    )
  })
}

export async function DELETE(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    // Authenticate the user with admin privileges
    await middlewares.withUser(request)

    const cs = services.server.CategoryService

    const category = await CategoryModel.findOne({
      _id: args.params.id,
      status: {
        $ne: utils.CONST.CATEGORY.STATUS.DELETED
      }
    })

    if (!category) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Category')
      })
    }

    // Delete the category
    await cs.deleteCategory(args.params.id)

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Category'),
        data: {
          category
        }
      })
    )
  })
}
