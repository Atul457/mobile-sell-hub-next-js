import {  Container,Grid, Typography } from "@mui/material"

import ShopFooter from "@/components/shop/ShopFooter"
import ShopHeader from "@/components/shop/ShopHeader"
import StoreSignupForm from "@/components/shop/StoreSignupForm"

const shopRegister = () => {
  return (
    <>
    <ShopHeader/>
     <Container>
      <Grid container spacing={4}>
        {/* First column: text */}
        <Grid item xs={12} md={6} mt={4}>
          <Typography variant="h4" gutterBottom>
            Join Our Platform
          </Typography>
          <Typography variant="body1">
            Sign up to start your store and choose a subscription plan. Manage your store easily and reach more customers.
          </Typography>
        </Grid>
          <Grid item xs={12} md={6}>
    <StoreSignupForm/>
    </Grid>
    </Grid>
    </Container>
    <ShopFooter/>
    </>
  )
}

export default shopRegister
