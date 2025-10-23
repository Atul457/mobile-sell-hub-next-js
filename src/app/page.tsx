import { Box, Typography } from '@mui/material'

const Root = () => {
  return (
    <Box
      maxHeight='100vh'
      minHeight='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      bgcolor='background.paper'
      px={3}
      textAlign='center'
      gap={3}
    >
      <Typography variant='h3' fontWeight={700} color='primary.main'>
        Welcome to Mobile Sell Hub
      </Typography>
      <Typography variant='body1' color='textPrimary' maxWidth={540}>
        Whether you're upgrading to the latest smartphone or selling your old device, Mobile Sell Hub connects you with
        buyers and sellers near you. Enjoy fast payments, verified users, and dedicated support.
      </Typography>
    </Box>
  )
}

export default Root
