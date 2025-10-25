import mongoose, { PipelineStage } from 'mongoose'

import { CONST } from '@/constants'
import { FILE_MANAGER } from '@/constants/fileManager.const'
import ChainOfCustodyModel from '@/models/custody.model'
import { IPackage } from '@/models/package.model'
import QrModel, { IQr } from '@/models/qr.model'
import { IReport } from '@/models/report.model'
import UserModel, { IUser } from '@/models/user.model'
import UserCreatorMappingModel from '@/models/userCreatorMapping.model'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { FileManagerService } from '@/services/FileManager.service'

import { mongo } from './mongo'
import { utils } from './utils'

type IGenerateReportContentArgs = {
  pid: IReport['pid']
  qr: IQr['qrCode']
  package: IPackage
}

type IGetRelatedUserIds = {
  loggedInUserId: any
  user?: IUser | null
}

const parseHL7Content = (_content: string) => {
  return ''
}

const readHl7FileContent = async (type: keyof typeof FILE_MANAGER.FOLDERS, fileName: string) => {
  let content = ''
  const fm = new FileManagerService()
  const readfile = await fm.readFile(type, fileName, 'utf-8')

  if (fm.productionEnv) {
    await readfile.data.data.every((c: any) => {
      content += c?.toString('utf-8')
      return true
    })
  } else {
    content = (readfile.data.data as any)?.data?.toString('utf-8')
  }

  return content
}

const parseHL7File = async (_fileName: string) => {
  return { hl7Message: '' }
}

const chainOfCustodyAdded = async (reportId: any) => {
  const qr = await QrModel.aggregate([
    {
      $match: {
        reportId: mongo.stringToObjectId(reportId)
      }
    },
    {
      $lookup: {
        localField: 'packageId',
        foreignField: '_id',
        from: 'packages',
        as: 'package',
        pipeline: [
          {
            $match: {
              status: CONST.PACKAGE.STATUS.ACTIVE
            }
          },
          {
            $project: {
              withChainOfCustody: 1
            }
          }
        ]
      }
    },
    {
      $unwind: {
        path: '$package'
      }
    }
  ])

  if (!qr.length) return false

  const package_ = qr[0].package as IPackage
  return package_.withChainOfCustody ?? false
}

const listChainOfCustody = async (reportId: string) => {
  const stages: PipelineStage[] = [
    {
      $match: {
        reportId: new mongoose.Types.ObjectId(reportId)
      }
    }
  ]

  const chainOfCustodies = await ChainOfCustodyModel.aggregate([...stages])
    .sort({
      createdAt: -1
    })
    .project({
      __v: 0
    })

  return utils.generateRes({
    status: true,
    data: {
      chainOfCustodies
    }
  })
}

const getRelatedUserIds = async (args: IGetRelatedUserIds) => {
  // @ts-expect-error: Complex union type too large for TS to handle
  const user = args.user ?? (await UserModel.findById(args.loggedInUserId).select(['type', 'role']))

  if (!user) {
    throw ErrorHandlingService.notFound({
      message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'User')
    })
  }

  const isSubUser = user.type === CONST.USER.TYPES.ORGANIZATION_SUB_USER

  let getMappingsQuery: Record<string, undefined | any> = {
    mainCreatorId: args.loggedInUserId
  }

  if (isSubUser) {
    const mapping = await UserCreatorMappingModel.findOne({
      userId: args.loggedInUserId
    }).select('mainCreatorId')

    if (mapping) {
      getMappingsQuery.mainCreatorId = mapping.mainCreatorId
    }
  }

  const userIds = await UserCreatorMappingModel.find(getMappingsQuery).distinct('userId')

  if (isSubUser) {
    userIds.push(getMappingsQuery.mainCreatorId)
  } else {
    userIds.push(args.loggedInUserId)
  }

  return {
    userIds,
    user,
    mainCreatorId: getMappingsQuery.mainCreatorId
  }
}

const generateReportContent = async (_args: IGenerateReportContentArgs) => {
  return {
    hl7FileStoragePath: '',
    fileName: ''
  }
}

const user = {
  getRelatedUserIds
}

const report = {
  parseHL7Content,
  readHl7FileContent,
  parseHL7File,
  listChainOfCustody,
  generateReportContent,
  chainOfCustodyAdded
}

const serverHelpers = {
  user,
  report
}

export { serverHelpers }

