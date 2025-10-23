'use client'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
// MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import type { ReactElement } from 'react'
import { useState } from 'react'

import Reports from '@/components/page-wise/reports/Reports'

const baseTabs = [

    {
        label: 'Reports',
        value: 'reports',
        icon: 'tabler-file-text'
    },

]

const userTabs = [...baseTabs]

type IViewProfileRelations = {
    id: string
}

const ViewProfileRelations = (props: IViewProfileRelations) => {

    const [activeTab, setActiveTab] = useState<string>(baseTabs[0].value); // Start with first tab

    const [tabs, _] = useState(userTabs);

    // Handle tab change
    const handleChange = (value: string) => {
        setActiveTab(value);
    };

    // Define the content for each tab
    const tabContentView: { [key: string]: ReactElement } = {
        reports: <Reports profileId={props.id} />,

    };

    return (
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <CustomTabList onChange={(_, value) => handleChange(value)} variant='scrollable' pill='true'>
                        {tabs.map((item, index) => (
                            <Tab
                                key={index}
                                icon={<i className={item.icon} />}
                                value={item.value}
                                label={item.label}
                                iconPosition='start'
                            />
                        ))}
                    </CustomTabList>
                </Grid>
                <Grid item xs={12}>
                    <TabPanel value={activeTab} className='p-0'>
                        {tabContentView[activeTab]}
                    </TabPanel>
                </Grid>
            </Grid>
        </TabContext>
    );
};


export default ViewProfileRelations
