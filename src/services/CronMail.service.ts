import { CONST } from '@/constants'
import { mailTemplates } from '@/mails/templates/index.template'
import MailModel, { IMail, IMailTypeContentMapping } from '@/models/mail.model'
import ReportModel, { IReportPopulated } from '@/models/report.model'
import { helpers } from '@/utils/helpers'
import { json } from '@/utils/json'
import { loops } from '@/utils/loops'
import { mongo } from '@/utils/mongo'
import { utils } from '@/utils/utils'

import MailService from './Mail.service'
import sMailService from './server/Mail.service'

class CronMailService {
  async getReport(reportId: string) {
    let report: IReportPopulated | null = null
    const reports = await ReportModel.aggregate([
      {
        $match: {
          _id: mongo.stringToObjectId(reportId)
        }
      },
      {
        $lookup: {
          from: 'qrs',
          localField: 'qrId',
          foreignField: '_id',
          as: 'qr',
          pipeline: [
            {
              $lookup: {
                from: 'packages',
                localField: 'packageId',
                foreignField: '_id',
                as: 'package',
                pipeline: [
                  {
                    $project: {
                      name: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: '$package',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                package: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$qr',
          preserveNullAndEmptyArrays: true
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
                firstName: 1,
                lastName: 1,
                email: 1
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
      }
    ])

    report = reports?.[0] ?? null
    return report
  }

  async cronMail() {
    let response = utils.generateRes({
      status: true
    })

    const ms = MailService
    const sms = sMailService
    let mail: IMail | null = null
    let subject: string | null = null
    let report: IReportPopulated | null = null

    const mails = await MailModel.aggregate([
      {
        $match: {
          status: CONST.MAIL.STATUS.PENDING
        }
      }
    ]).limit(100)

    response.data = {
      ...response.data,
      mails
    }

    await loops.asyncWhileLoop({
      loopCount: mails.length,
      functionToFire: async index => {
        subject = null
        mail = { ...mails[index] } as IMail

        if (!mail) return

        switch (true) {
          case (['report-rejection', 'report-complete', 'report-receive'] as IMail['type'][]).includes(mail.type):
            {
              let data = json.getParsedJson(mail.data) as IMailTypeContentMapping['report-rejection']

              response.data = {
                ...response.data,
                reportIds: [...(response.data.reportIds ?? []), data.reportId]
              }

              report = await this.getReport(data.reportId as unknown as string)

              if (report && report.user && report.qr) {
                if (mail.type === 'report-receive') {
                  subject = CONST.MAIL.SUBJECTS.SAMPLE_RECIEVED
                } else if (mail.type === 'report-rejection') {
                  subject = CONST.MAIL.SUBJECTS.SAMPLE_REJECTED
                } else {
                  subject = CONST.MAIL.SUBJECTS.REPORT_PROCESSED
                }

                response.data = {
                  ...response.data,
                  subjects: [...(response.data.subjects ?? []), subject]
                }

                if (subject) {
                  const mailTemplate = mailTemplates[CONST.MAIL.MAPPING[mail.type]]
                  const keysToReplace = mailTemplate.keysToReplace as typeof mailTemplates.reportProcessed.keysToReplace

                  await ms.cronMail({
                    email: report.user.email,
                    subject,
                    content: mailTemplate.template
                      .replace(keysToReplace.userName, helpers.user.getFullName(report.user))
                      .replace(keysToReplace.testName, report.qr?.package?.name ?? '')
                      .replace(keysToReplace.reportId, report.identifier)
                      .replace(keysToReplace.loginUrl, process.env.NEXT_PUBLIC_USER_APP_HOSTNAME ?? '')
                  })

                  response.data = {
                    ...response.data,
                    mailIds: [...(response.data.mailIds ?? []), mail._id]
                  }

                  await sms.updateMail(mail._id as unknown as string, {
                    status: CONST.MAIL.STATUS.SENT
                  })
                }
              }
            }
            break
        }
      }
    })

    return response
  }
}

export default new CronMailService()
