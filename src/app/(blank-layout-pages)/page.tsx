import { Container, Typography } from '@mui/material';

import MultiStepStoreSignup from '@/components/shop/MultiStepStoreSignup';

const Root = () => {
    return (
        <div className='bg-custom-gradient min-bs-[calc(100dvh)] relative p-6 flex justify-center items-center'>
            <Container>
                <div className='max-md:space-y-4 md:space-x-4 flex justify-center md:flex-row max-md:flex-col'>
                    {/* First column: text */}
                    <div className='md:max-is-[300px]'>
                        <Typography variant='h4' gutterBottom color='white'>
                            Join Our Platform
                        </Typography>
                        <Typography variant='body1' color='white'>
                            Sign up to start your store and choose a subscription plan. Manage your store easily and
                            reach more customers.
                        </Typography>
                    </div>
                    <div className='md:is-full md:max-is-[700px] bg-white max-md:py-[30px] max-md:px-[20px] md:p-[40px] rounded-lg'>
                        <MultiStepStoreSignup />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Root;
