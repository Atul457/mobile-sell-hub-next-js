'use client'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {  Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { toast } from 'react-toastify'

const IframeShareCard = () => {
  const iframeLink = 'https://example.com/embed-page' // replace with your iframe link
  const iframeCode = `<iframe src="${iframeLink}" width="100%" height="400" style="border:none;"></iframe>`


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode)
      toast.success(' Iframe code copied!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Card sx={{mb:4}}>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Add this iframe anywhere to your website or customer portal — they will be able to see it like this:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography fontSize={12} fontWeight={500}>
            {iframeCode}
          </Typography>
          <Tooltip title='Copy iframe code'>
            <IconButton onClick={handleCopy} color='primary'>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

      </CardContent>
    </Card>

  )
}

export default IframeShareCard
