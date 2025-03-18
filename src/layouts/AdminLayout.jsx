import { Box, CssBaseline, Toolbar } from '@mui/material'
import Header from './AdminHeader'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import UserSidebar from './UserSidebar'
import PropTypes from 'prop-types'

export const AdminLayout = ({isAdmin}) => {
  console.log(isAdmin);
  return (
    <>
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Header sx={{marginLeft : '400px'}}/>
            {isAdmin ? <Sidebar/> : <UserSidebar/>}
            <Box component={"main"} sx={{flexGrow : 1, p : 3}}>
                <Toolbar/>
                <Outlet/>
            </Box>

        </Box>
    </>
  )
}

AdminLayout.propTypes = {
  isAdmin : PropTypes.bool
}
