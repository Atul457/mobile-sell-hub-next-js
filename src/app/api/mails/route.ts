/* eslint-disable no-console */
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
// import MailModel from '@/models/mail.model'
import CronMailService from '@/services/CronMail.service'
// import UserModel from '@/models/user.model'
import { utils } from '@/utils/utils'

export async function POST(_: NextRequest) {
  return utils.errorHandler(async function () {
    await dbConfig()
    const response = await CronMailService.cronMail()
    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          ...response.data
        }
      })
    )
  })
}
