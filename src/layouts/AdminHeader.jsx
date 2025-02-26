import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="fixed" >
      <Toolbar>
        <Typography variant="h6" marginLeft={'100px'} noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;