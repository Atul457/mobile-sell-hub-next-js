import { Box, Container, Grid, Typography } from "@mui/material"

import StoreSignupForm from "@/components/shop/StoreSignupForm"

const Root = () => {
  return (
    <Box sx={{backgroundColor:"#000", height:"100vh", display:"flex", alignItems:"center"}}>
    <Container>
      <Grid container spacing={4}>
        {/* First column: text */}
        <Grid item xs={12} md={6} mt={4} sx={{color:"#fff"}}>
          <Typography variant="h4" gutterBottom>
            Join Our Platform
          </Typography>
          <Typography variant="body1">
            Sign up to start your store and choose a subscription plan. Manage your store easily and reach more customers.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <StoreSignupForm />
        </Grid>
      </Grid>
    </Container>
    </Box>
  )
}

export default Root
