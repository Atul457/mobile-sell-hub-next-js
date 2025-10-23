import { IRequestArgs } from '@/app/api/types'
import { dbConfig } from '@/configs/dbConfig'
import PackageModel, { IPackage } from '@/models/package.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    // Authenticate the user with admin privileges
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.PACKAGE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
    })

    await av.validate()

    const ps = services.server.PackageService

    // Get the request body
    const body = await utils.getReqBody(request)

    // Validate the request body
    await serverSchemas.objectIdSchema.required().validate(args.params.id)

    const validatedData = await serverSchemas.addPackage.validate(body ?? {})

    const { name, price, status, description, identifier, isDefault, withChainOfCustody } = validatedData

    const existingPackage = await PackageModel.findOne({
      _id: args.params.id,
      status: {
        $ne: utils.CONST.PACKAGE.STATUS.DELETED
      }
    })

    if (!existingPackage) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Package')
      })
    }

    const existsingPackageWithSameIdentifier = await PackageModel.findOne({
      _id: { $ne: args.params.id },
      identifier,
      status: {
        $ne: utils.CONST.PACKAGE.STATUS.DELETED
      }
    })

    if (existsingPackageWithSameIdentifier) {
      throw ErrorHandlingService.conflict({
        message: utils.CONST.RESPONSE_MESSAGES._ALREADY_EXISTS.replace('[ITEM]', 'Package with this identifier')
      })
    }

    // Update the package
    const package_ = await ps.updatePackage(args.params.id, {
      name,
      price,
      status: status as IPackage['status'],
      description,
      identifier,
      isDefault: Boolean(isDefault),
      withChainOfCustody: Boolean(withChainOfCustody)
    })

    if (isDefault && package_) {
      await ps.makeDefault(package_._id as string)
    }

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Package'),
        data: {
          package: package_
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
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.PACKAGE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.DELETE
    })

    await av.validate()
    const ps = services.server.PackageService

    const package_ = await PackageModel.findOne({
      _id: args.params.id,
      status: {
        $ne: utils.CONST.PACKAGE.STATUS.DELETED
      }
    })

    if (!package_) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Package')
      })
    }

    // Delete the package
    await ps.deletePackage(args.params.id)

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Package'),
        data: {
          package: package_
        }
      })
    )
  })
}
