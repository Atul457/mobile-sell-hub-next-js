import { dbConfig } from '@/configs/dbConfig'
import { serverSchemas } from '@/schemas/server.schemas'
import { services } from '@/services/index.service'
import { utils } from '@/utils/utils'

export async function POST(request: Request) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    const sr = services.server.ShopRegisterService

    // Get the request body
    const body = await utils.getReqBody(request)

    // // Validate the request body
    const validatedData = await serverSchemas.storeSchema.validate(body ?? {})
    const { firstName, lastName, email, storeName, password } = validatedData

    // // Create the category
    const register = await sr.registerShop({
      firstName,
      lastName,
      email,
      storeName,
      password
    })

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES.ACCOUNT_CREATED,
        data: {
          register
        }
      })
    )
  })
}
