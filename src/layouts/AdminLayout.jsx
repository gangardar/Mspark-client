import { Box, CssBaseline, Toolbar } from '@mui/material'
import Header from './AdminHeader'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export const AdminLayout = () => {
  return (
    <>
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Header sx={{marginLeft : '400px'}}/>
            <Sidebar/>
            <Box component={"main"} sx={{flexGrow : 1, p : 3}}>
                <Toolbar/>
                <Outlet/>
            </Box>

        </Box>
    </>
  )
}
