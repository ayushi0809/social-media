import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "./SignUp";
import UserProfile from "./UserProfile";
import SearchUsers from "./SearchUsers";
import NavBar from "../components/NavBar";

const Pages = (props) => {
  return (
    <BrowserRouter>
      <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%" }}>
        <NavBar />
      </Box>
      <Box sx={{ width: "100vw", minHeight: "100vh", pt: 8 }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/users' element={<SearchUsers />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default Pages;
