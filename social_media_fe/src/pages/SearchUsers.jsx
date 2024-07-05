// src/pages/SearchUsers.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function SearchUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoding(true);
        const response = await axios.get(
          "http://localhost:3100/api/users/list",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);
        // setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoding(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoding(true);
      const response = await axios.get(
        `http://localhost:3100/api/users/search?name=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoding(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    console.log(localStorage.getItem("token"));
    try {
      setIsLoding(true);
      const response = await axios.put(
        `http://localhost:3100/api/users/${
          isFollowing ? "unfollow" : "follow"
        }/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const user = await axios.get("http://localhost:3100/api/users/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(user.data);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Users
        </Typography>
        <Box sx={{ display: "flex", mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ ml: 2 }}
          >
            Search
          </Button>
        </Box>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem
                key={user._id}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
                <Button
                  variant="contained"
                  color={user.isFollowing ? "secondary" : "primary"}
                  onClick={() => handleFollow(user._id, user.isFollowing)}
                  sx={{ ml: 2 }}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default SearchUsers;
