import { CardService } from './client/Card.service'
import { CategoryService } from './client/Category.service'
import { ConfigService } from './client/Config.service'
import { ReportService } from './client/ReportService'
import { UserService } from './client/User.service'
import { UserCreatorMappingService } from './client/UserCreatorMapping.service'
import { UsersService } from './client/Users.service'
import CronMailService from './CronMail.service'
import { ErrorHandlingService } from './ErrorHandling.service'
import { FileManagerService } from './FileManager.service'
import FileValidatorService from './FileValidator.service'
import MailService from './Mail.service'
import sCardService from './server/Card.service'
import sCategoryService from './server/Category.service'
import ChainOfCustodyService from './server/ChainOfCustody.service'
import FileService from './server/File.service'
import sMailService from './server/Mail.service'
import PackageService from './server/Package.service'
import ProfileService from './server/Profile.service'
import QrService from './server/Qr.service'
import sReportService from './server/Report.service'
import RoleService from './server/Role.service'
import RolePermissionService from './server/RolePermission.service'
import TransactionService from './server/Transaction.service'
import sUserService from './server/User.service'
import sUserCreatorMappingService from './server/UserCreatorMapping.service'
import UserSessionService from './server/UserSession.service'
import StripeService from './Stripe.service'

export const services = {
  CronMailService,
  FileValidatorService,
  ErrorHandlingService,
  FileManagerService,
  MailService,
  StripeService,
  server: {
    CardService: sCardService,
    TransactionService,
    ReportService: sReportService,
    PackageService,
    CategoryService: sCategoryService,
    FileService,
    RolePermissionService,
    UserService: sUserService,
    UserSessionService,
    MailService: sMailService,
    ProfileService,
    ChainOfCustodyService,
    QrService,
    UserCreatorMappingService: sUserCreatorMappingService,
    RoleService
  },
  client: {
    CardService,
    UserService,
    ReportService,
    ConfigService,
    UserCreatorMappingService,
    UsersService,
    CategoryService
  }
}
