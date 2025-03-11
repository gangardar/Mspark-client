import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
        component="footer"
        sx={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '50px',
        }}
        >
        <Typography variant="body1">
        © 2025 Ruby & Jade Market. All rights reserved.
        </Typography>
    </Box>
  )
}

export default Footer

{/* Footer Section */}
