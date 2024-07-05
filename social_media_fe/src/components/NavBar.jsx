import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NavBar() {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Social Media App
        </Typography>
        <Box>
          <Button color='inherit' component={RouterLink} to='/'>
            Home
          </Button>
          <Button color='inherit' component={RouterLink} to='/users'>
            Search Users
          </Button>
          <Button color='inherit' component={RouterLink} to='/login'>
            Login
          </Button>
          <Button color='inherit' component={RouterLink} to='/signup'>
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
