import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";

function UserProfile() {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          User Profile
        </Typography>
        <Button variant='contained' sx={{ mt: 2 }}>
          Follow
        </Button>
      </Box>
    </Container>
  );
}

export default UserProfile;
