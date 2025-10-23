'use client'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
// MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import Reports from '@/components/page-wise/reports/Reports'

import { IRolePermission } from '@/models/rolePermission.model'
import { IUser } from '@/models/user.model'
import { utils } from '@/utils/utils'

import Profiles from './user-relations/Profiles'
import Transactions from './user-relations/Transactions'
import Users from '../../Users'

const baseTabs = [
  {
    label: 'Examinees',
    value: 'profiles',
    icon: 'tabler-users'
  },
  {
    label: 'Reports',
    value: 'reports',
    icon: 'tabler-file-text'
  },
  {
    label: 'Transactions',
    value: 'transactions',
    icon: 'tabler-currency-dollar'
  }
]

// Define tabs for users
const userTabs = [...baseTabs]

// Define tabs for gamers
const organizationTabs = [...baseTabs]

type IUserRelations = {
  user: IUser
  id: string
  userModulePermissions: IRolePermission['actions']
}

const UserRelations = (props: IUserRelations) => {
  const { user, userModulePermissions } = props
  const [activeTab, setActiveTab] = useState<null | string>(null)

  const haveEmployeeReadPermission = userModulePermissions.includes(utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ)

  // Determine the tabs based on user type
  const [tabs, setTabs] = useState(userTabs)

  // Handle tab change
  const handleChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    if (typeof user?.type === 'number') {
      const isOrganization = user ? utils.helpers.user.checkIsOrganiation(user.type) : null
      let organizationTabs_ = [...organizationTabs]
      if (haveEmployeeReadPermission) {
        organizationTabs_.unshift({
          label: 'Employees',
          value: 'employees',
          icon: 'tabler-user-edit'
        })
      }
      const tabs = isOrganization ? organizationTabs_ : userTabs
      setTabs(tabs)
      setActiveTab(tabs[0].value)
    }
  }, [user?.type])

  // Define the content for each tab
  const tabContentView: { [key: string]: ReactElement } = {
    ...(haveEmployeeReadPermission && {
      employees: <Users userId={props.id} />
    }),
    profiles: <Profiles userId={props.id} />,
    reports: <Reports userId={props.id} />,
    transactions: <Transactions userId={props.id} />
  }

  if (!activeTab) {
    return null
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* Custom tab list with tabs */}
          <CustomTabList onChange={(_, value) => handleChange(value)} variant='scrollable' pill='true'>
            {tabs.map((item, index) => (
              <Tab
                key={index}
                icon={<i className={item.icon} />}
                value={item?.value}
                label={item?.label}
                iconPosition='start'
              />
            ))}

          </CustomTabList>

        </Grid>
        <Grid item xs={12}>
          {/* Display the content of the active tab */}
          <TabPanel value={activeTab} className='p-0'>
            {tabContentView[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default UserRelations
