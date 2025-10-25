import { utils } from '@/utils/utils'

export async function POST(_: Request) {
  return utils.errorHandler(async function () {
    return Response.json(
      utils.generateRes({
        status: true
      })
    )
  })
}
