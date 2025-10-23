import FormData from 'form-data'
import fs_ from 'fs'
import mongoose, { PipelineStage } from 'mongoose'
import hl7 from 'simple-hl7'

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

import { currentDateTime } from './currentDateTime'
import { http } from './http'
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

const parseHL7Content = (content: string) => {
  let hl7Message: hl7.HL7Message | null = null

  const message = content.replace(/\n/g, '\r')
  const parser = new hl7.Parser()

  try {
    hl7Message = parser.parse(message)
  } catch (error) {
    console.error('Error parsing message:', error)
  }

  return hl7Message
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

const parseHL7File = async (fileName: string) => {
  const fms = new FileManagerService()
  const file = await fms.readFile('reports', fileName, 'utf-8')

  let hl7Message: hl7.HL7Message | null = null

  if (file.status) {
    const message = file.data.data.toString().replace(/\n/g, '\r')
    const parser = new hl7.Parser()

    try {
      hl7Message = parser.parse(message)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  } else {
    console.error('Failed to read the file.')
  }

  return { hl7Message }
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

const generateReportContent = async (args: IGenerateReportContentArgs) => {
  const adt = new hl7.Message(
    'Novotech',
    'NVOTH',
    'LIMSABC',
    'main central',
    currentDateTime(),
    '',
    'ORM',
    '0dee417a-4371-4a07-8b49-c2fa77ca171d',
    'P',
    '2.7',
    '',
    '',
    '',
    'AL',
    ''
  )

  adt.addSegment(
    'PID',
    1,
    `${args.pid ?? ''}`,
    '',
    '',
    ['Sample', 'Novotech'],
    '', // Multiple components
    '19900101',
    'U',
    '',
    '0000-0',
    ['MAYBE NOVOTECH HQ', '', 'Atlanta', 'GA', '99999'],
    '',
    '',
    '',
    ''
  )

  adt.addSegment('PV1', 1, 'U', '')
  adt.addSegment(
    'ORC',
    'NW',
    args.qr,
    '',
    '',
    '',
    '',
    '',
    '',
    currentDateTime(),
    '',
    '',
    ['123456789', 'Test Doctor'],
    '',
    '',
    currentDateTime(),
    ''
  )

  adt.addSegment(
    'OBR',
    1,
    args.qr,
    '',
    [`${args.package.identifier}^${args.package.identifier}`],
    '',
    currentDateTime(),
    currentDateTime(),
    ''
  )

  adt.addSegment('DG1', 1, '', ['Encounter for screening', 'unspecified'], '')

  adt.addSegment('NTE', 1, 'HOLD', '')

  const hl7Message = adt.log()

  const fm = new FileManagerService()

  const fileName = utils.file.generateUniqueFileName(new File([], 'random.hl7'))

  const {
    data: { filePath: hl7FileStoragePath, fullFilePath: fullHl7FilePath }
  } = await fm.writeFile('reports', fileName, hl7Message, 'text/plain')

  let fileData

  const form = new FormData()

  if (fm.productionEnv) {
    const file = await fm.readFile('reports', hl7FileStoragePath)
    fileData = file.data.data
    form.append('file', fileData, fileName)
  } else {
    fileData = fs_.createReadStream(fullHl7FilePath)
    form.append('file', fileData, fileName)
  }

  await http({
    baseUrl: `${process.env.HL7_HOSTNAME}/api/`,
    method: 'POST',
    url: 'hl7/upload',
    formData: true,
    data: form
  })

  return {
    hl7FileStoragePath,
    fileName
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
