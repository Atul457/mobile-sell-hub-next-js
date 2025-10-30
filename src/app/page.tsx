import { Box, Container, Grid, Typography } from '@mui/material';

import MultiStepStoreSignup from '@/components/shop/MultiStepStoreSignup';

const Root = () => {
    return (
        <Box sx={{ backgroundColor: '#000', minHeight: '100dvh', display: 'flex', alignItems: 'center' }}>
            <Container>
                <Grid container spacing={0}>
                    {/* First column: text */}
                    <Grid item xs={12} md={4} mt={4} sx={{ color: '#fff', paddingRight: '10px' }}>
                        <Typography variant='h4' gutterBottom>
                            Join Our Platform
                        </Typography>
                        <Typography variant='body1'>
                            Sign up to start your store and choose a subscription plan. Manage your store easily and
                            reach more customers.
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={8}
                        sx={{ backgroundColor: '#fff', color: '#000', padding: '30px', borderRadius: '10px' }}
                    >
                        <MultiStepStoreSignup />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Root;
