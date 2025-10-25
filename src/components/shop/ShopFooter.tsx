
import { Box, Typography } from '@mui/material'


const ShopFooter = () => {

  return (
       <Box
      component="footer"
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        p: 2,
        mt: 5
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </Typography>
    </Box>
  );

}

export default ShopFooter
