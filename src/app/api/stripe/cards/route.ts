import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import CardModel, { IUserCardTypes } from '@/models/card.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function GET(request: NextRequest) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)

    const body = utils.searchParamsToJson({
      params: request.nextUrl.searchParams
    })

    const {
      page = 1,
      limit = 10,
      query = null,
      sort = 'createdAt',
      order = 'desc'
    } = await commonSchemas.paginationSchema.validate({
      ...(body ?? {})
    })

    const stages = [
      {
        $match: {
          userId: authData.userId
        }
      },
      {
        $match: {
          ...(query && {
            $or: [
              { name: { $regex: new RegExp(query, 'gi') } },
              { brand: { $regex: new RegExp(query, 'gi') } },
              { cardNumber: { $regex: new RegExp(query, 'gi') } }
            ]
          })
        }
      }
    ]

    const totalCount_ = await CardModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const cards = await CardModel.aggregate([...stages])
      .sort({
        [sort]: order
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        createdAt: 0,
        updatedAt: 0,
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
          cards
        }
      })
    )
  })
}

export async function POST(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request, {
      select: ['stripeCustomerId']
    })

    const cs = services.server.CardService
    const ss = services.StripeService
    const us = services.server.UserService

    const body = await utils.getReqBody(request)

    const validatedData = await commonSchemas.addCardWithTokenRequired.validate(body ?? {})

    const { token, name } = validatedData

    if (!authData.stripeCustomerId) {
      const customer = await ss.createCustomer(authData.email, utils.helpers.user.getFullName(authData))

      await us.updateUser(authData.userId, {
        stripeCustomerId: customer.id
      })

      authData.stripeCustomerId = customer.id
    }

    const stripeCard = await ss.addCard(authData.stripeCustomerId, token, name)

    if (!stripeCard) {
      throw ErrorHandlingService.somethingWentWrong({
        data: {
          stripeCard
        },
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Card')
      })
    }

    let card: IUserCardTypes | null = null

    const baseCard: Partial<IUserCardTypes> = {
      userId: authData.userId,
      cardId: stripeCard.id,
      brand: stripeCard.brand,
      expMonth: stripeCard.exp_month,
      expYear: stripeCard.exp_year,
      cardNumber: stripeCard.last4,
      country: stripeCard.country,
      cardFingerprint: stripeCard?.fingerprint
    }

    if (stripeCard?.fingerprint) {
      const existingCard = await cs.getCardByFingerprint(stripeCard?.fingerprint, authData.userId)
      if (existingCard) {
        throw ErrorHandlingService.userAlreadyExists({
          message: utils.CONST.RESPONSE_MESSAGES._ALREADY_EXISTS.replace('[ITEM]', 'Card')
        })
      }
    }

    card = await cs.createCard(baseCard)

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Card'),
        data: {
          card
        }
      })
    )
  })
}
