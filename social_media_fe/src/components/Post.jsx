import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
} from "@mui/icons-material";
import axios from "axios";
import Comment from "./Comment";

function Post({ post, setPosts }) {
  const currentUserId = localStorage.getItem("token");
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const postRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          try {
            const likeResponse = await axios.get(
              `http://localhost:3100/api/like/${post._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setIsLiked(likeResponse.data.isLiked);

            const commentsResponse = await axios.get(
              `http://localhost:3100/api/comments/${post._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            console.log(commentsResponse.data);
            const filteredComments = commentsResponse.data.filter(
              (comment) => comment.parentComment === null
            );
            setComments(filteredComments);
            // setComments(commentsResponse.data);
          } catch (error) {
            console.error("Error fetching comments and likes:", error);
          } finally {
            setIsLoadingComments(false);
          }
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Adjust this value as needed
      }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, []);

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3100/api/like/${isLiked ? "unlike" : "like"}/${
          post._id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const discussion = await axios.get(
        `http://localhost:3100/api/discussions/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLikes(discussion.data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      await axios.post(
        `http://localhost:3100/api/comments/create`,
        { text: newComment, postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const response = await axios.get(
        `http://localhost:3100/api/comments/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const filteredComments = response.data.filter(
        (comment) => comment.parentComment === null
      );
      setComments(filteredComments);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Card sx={{ mb: 2 }} ref={postRef}>
      <CardContent>
        <Typography variant="body1">{post.text}</Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />} {likes}
        </IconButton>
        <IconButton onClick={() => setShowComments(!showComments)}>
          <CommentIcon /> {comments.length}
        </IconButton>
      </CardActions>
      {showComments && (
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddComment}>
            Comment
          </Button>
          {isLoadingComments ? (
            <CircularProgress />
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                setComments={setComments}
              />
            ))
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default Post;
