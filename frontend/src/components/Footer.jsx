import React from 'react'
import { Box, Typography } from '@mui/material'

export default function Footer(){
  return (
    <Box component="footer" sx={{ mt:4, py:2, textAlign:'center' }}>
      <Typography variant="caption">© EmergencyIQ</Typography>
    </Box>
  )
}
