import { Box, Typography } from '@mui/material'
import React from 'react'

type CustomNoRowsOverlayProps = {
  message?: string
}

const CustomNoRowsOverlay: React.FC<CustomNoRowsOverlayProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Typography variant='h6' color='textSecondary'>
        {message || 'No rows'}
      </Typography>
    </Box>
  )
}

export default CustomNoRowsOverlay
