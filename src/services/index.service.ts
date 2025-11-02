import { CategoryService } from './client/Category.service';
import { ConfigService } from './client/Config.service';
import { TagService } from './client/Tag.service';
import { UserService } from './client/User.service';
import { UsersService } from './client/Users.service';
import { ErrorHandlingService } from './ErrorHandling.service';
import { FileManagerService } from './FileManager.service';
import FileValidatorService from './FileValidator.service';
import MailService from './Mail.service';
import sCategoryService from './server/Category.service';
import FileService from './server/File.service';
import sMailService from './server/Mail.service';
import RoleService from './server/Role.service';
import RolePermissionService from './server/RolePermission.service';
import sShopRegisterService from './server/ShopRegister.service';
import sTagService from './server/Tag.service';
import sUserService from './server/User.service';
import UserSessionService from './server/UserSession.service';
import StripeService from './Stripe.service';

export const services = {
    FileValidatorService,
    ErrorHandlingService,
    FileManagerService,
    MailService,
    StripeService,
    server: {
        CategoryService: sCategoryService,
        TagService: sTagService,
        ShopRegisterService: sShopRegisterService,
        FileService,
        RolePermissionService,
        UserService: sUserService,
        UserSessionService,
        MailService: sMailService,
        RoleService
    },
    client: {
        UserService,
        ConfigService,
        UsersService,
        CategoryService,
        TagService
    }
};
