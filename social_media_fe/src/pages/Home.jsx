import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Favorite, Comment as CommentIcon } from "@mui/icons-material";
import Post from "../components/Post";

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newHashtag, setNewHashtag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("text", newPost);
      formData.append("image", newImage);
      formData.append("hashtags", newHashtag);

      const response = await axios.post(
        "http://localhost:3100/api/discussions/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh posts after successful submission
      const postsResponse = await axios.get(
        "http://localhost:3100/api/discussions/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts(postsResponse.data);
      setNewPost("");
      setNewImage(null);
      setNewHashtag("");
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:3100/api/discussions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3100/api/discussions/tags?tags=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>
        <Box sx={{ display: "flex", mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search by hashtag"
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
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            label="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Hashtag"
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 2, ml: 2 }}
            onClick={handlePost}
          >
            Post
          </Button>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} setPosts={setPosts} />
          ))
        )}
      </Box>
    </Container>
  );
}

export default Home;
