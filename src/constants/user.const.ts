import { IProfile } from '@/models/profile.model'
import { IUser } from '@/models/user.model'

const MALE = {
  LABEL: 'Male',
  VALUE: 1 as IProfile['gender']
}

const DELETED = {
  LABEL: 'Deleted',
  VALUE: 2 as IUser['status']
}

const ACTIVE = {
  LABEL: 'Active',
  VALUE: 1 as IUser['status']
}

const INACTIVE = {
  LABEL: 'Inactive',
  VALUE: 0 as IUser['status']
}

const PENDING = {
  LABEL: 'Pending',
  VALUE: 3 as IUser['status']
}

const FEMALE = {
  LABEL: 'Female',
  VALUE: 2 as IProfile['gender']
}

const TRANS = {
  LABEL: 'Other',
  VALUE: 3 as IProfile['gender']
}

const INDIVIDUAL = {
  LABEL: 'Individual',
  VALUE: 2 as IUser['type']
}

const DIRECTOR = {
  LABEL: 'Executive/Director',
  VALUE: 1 as IUser['designation']
}

const MANAGER = {
  LABEL: 'Program Manager',
  VALUE: 2 as IUser['designation']
}

const MANAGER_ROLE = {
  LABEL: 'Manager',
  VALUE: 2 as IUser['role']
}

const ADMIN_ROLE = {
  LABEL: 'Admin',
  VALUE: 1 as IUser['role']
}

const TEST_ADMINISTRATOR_ROLE = {
  LABEL: 'Test Administrator',
  VALUE: 4 as IUser['role']
}

const STAFF_ROLE = {
  LABEL: 'Reviewer',
  VALUE: 3 as IUser['role']
}

const SUPERVISOR = {
  LABEL: 'Test Administrator',
  VALUE: 3 as IUser['designation']
}

const ADMIN = {
  LABEL: 'Admin',
  VALUE: 1 as IUser['type']
}

const CORPORATE_EMPLOYER = {
  LABEL: 'Corporate/Employer',
  VALUE: 3 as IUser['type']
}

const THIRD_PARTY_ADMINISTRATOR = {
  LABEL: '3rd Party Administrators',
  VALUE: 4 as IUser['type']
}

const GOVT_ORGANISATION = {
  LABEL: 'Govt Organisations/Institutions',
  VALUE: 5 as IUser['type']
}

const ORGANIZATION_SUB_USER = {
  LABEL: 'Sub User',
  VALUE: 6 as IUser['type']
}

const SUB_ADMIN = {
  LABEL: 'Sub Admin',
  VALUE: 7 as IUser['type']
}

const USER = {
  STATUS: {
    DELETED: DELETED.VALUE,
    ACTIVE: ACTIVE.VALUE,
    INACTIVE: INACTIVE.VALUE,
    PENDING: PENDING.VALUE
  },
  NUMERIC_STATUS: {
    2: DELETED.LABEL,
    1: ACTIVE.LABEL,
    0: INACTIVE.LABEL,
    3: PENDING.LABEL
  },
  OBJECT_STATUSES: {
    DELETED,
    ACTIVE,
    INACTIVE,
    PENDING
  },
  MAX_PROFILE_PICTURE_SIZE: 1,
  VALID_PROFILE_PICTURE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  DEFAULT_PROFILE_PICTURE: '/images/icons/user-badge.svg',
  TYPES: {
    INDIVIDUAL: INDIVIDUAL.VALUE,
    ADMIN: ADMIN.VALUE,
    CORPORATE_EMPLOYER: CORPORATE_EMPLOYER.VALUE,
    THIRD_PARTY_ADMINISTRATOR: THIRD_PARTY_ADMINISTRATOR.VALUE,
    GOVT_ORGANISATION: GOVT_ORGANISATION.VALUE,
    ORGANIZATION_SUB_USER: ORGANIZATION_SUB_USER.VALUE,
    SUB_ADMIN: SUB_ADMIN.VALUE,
  },
  NUMERIC_TYPES: {
    1: ADMIN.LABEL,
    2: INDIVIDUAL.LABEL,
    3: CORPORATE_EMPLOYER.LABEL,
    4: THIRD_PARTY_ADMINISTRATOR.LABEL,
    5: GOVT_ORGANISATION.LABEL,
    6: ORGANIZATION_SUB_USER.LABEL,
    7: SUB_ADMIN.LABEL,
  },
  OBJECT_TYPES: {
    ADMIN,
    INDIVIDUAL,
    CORPORATE_EMPLOYER,
    THIRD_PARTY_ADMINISTRATOR,
    GOVT_ORGANISATION,
    ORGANIZATION_SUB_USER,
    SUB_ADMIN
  },
  DESIGNATIONS: {
    DIRECTOR: DIRECTOR.VALUE,
    MANAGER: MANAGER.VALUE,
    SUPERVISOR: SUPERVISOR.VALUE
  },
  NUMERIC_DESIGNATION_TYPES: {
    1: DIRECTOR.LABEL,
    2: MANAGER.LABEL,
    3: SUPERVISOR.LABEL
  },
  OBJECT_DESIGNATION_TYPES: {
    DIRECTOR,
    MANAGER,
    SUPERVISOR
  },
  ROLES: {
    ADMIN: ADMIN_ROLE.VALUE,
    MANAGER: MANAGER_ROLE.VALUE,
    STAFF: STAFF_ROLE.VALUE,
    TEST_ADMINISTRATOR: TEST_ADMINISTRATOR_ROLE.VALUE
  },
  NUMERIC_ROLE_TYPES: {
    1: ADMIN_ROLE.LABEL,
    2: MANAGER_ROLE.LABEL,
    3: STAFF_ROLE.LABEL,
    4: TEST_ADMINISTRATOR_ROLE.LABEL
  },
  OBJECT_ROLE_TYPES: {
    ADMIN: ADMIN_ROLE,
    MANAGER: MANAGER_ROLE,
    STAFF: STAFF_ROLE,
    TEST_ADMINISTRATOR: TEST_ADMINISTRATOR_ROLE
  },
  NUMERIC_GENDER_TYPES: {
    1: MALE.LABEL,
    2: FEMALE.LABEL,
    3: TRANS.LABEL
  },
  OBJECT_GENDER_TYPES: {
    MALE,
    FEMALE,
    TRANS
  }
}

export { USER }
