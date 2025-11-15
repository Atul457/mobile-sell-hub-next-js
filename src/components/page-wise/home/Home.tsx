'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import CommonNotFound from '@/components/common/CommonNotFound';
import Loader from '@/components/Loader';

import { useAppSelector } from '@/store/hooks/hooks';

import { DashboardService } from '@/services/client/Dashboard.service';
import { utils } from '@/utils/utils';

import StatCard from './components/StatCard';
import { DashboardData } from './types/home.type';

const Home = () => {
    const user = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<DashboardData>(null);

    const loadDashboardData = useCallback(async () => {
        try {
            const ds = new DashboardService();
            const data = await ds.get();
            setDashboard(data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            utils.toast.error({ message: utils.error.getMessage(error) });
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    if (loading)
        return (
            <Box className='min-h-[300px] flex items-center justify-center'>
                <Loader size='md' />
            </Box>
        );

    if (!dashboard) {
        return (
            <Card>
                <CardContent>
                    <CommonNotFound description='Stats not found' withoutImage={true} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant='h5' sx={{ mb: 5 }}>
                Hello {utils.helpers.user.getFullName(user.data.user!)}, manage your Phone Sell Hub operations here.
            </Typography>

            <Grid container spacing={3}>
                {dashboard.stats.map((stat) => (
                    <Grid item xs={12} sm={6} key={stat.key}>
                        <StatCard _key={stat.key} value={stat.value} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Home;
