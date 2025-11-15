import { Box, Card, CardContent, Typography } from '@mui/material';

import { HOME_CONST } from '../constants/home.const';
import { DashboardModuleType } from '../types/home.type';

type StatCardProps = {
    _key: DashboardModuleType;
    value: number;
};

const StatCard = (props: StatCardProps) => {
    const { _key, value } = props;
    const [icon, color, label] = HOME_CONST.STATS_COLORS_MAPPING[_key];

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 5,
                borderRadius: 2,
                boxShadow: 3
            }}
        >
            <Box
                sx={{
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    borderRadius: '50%',
                    p: 1.5
                }}
            >
                <i className={`tabler-icon ${icon}`} style={{ fontSize: 28, color: color }} />
            </Box>

            <CardContent className='!p-0'>
                <Typography variant='h6' fontWeight={600}>
                    {value}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatCard;
