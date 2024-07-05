import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Favorite, Reply } from "@mui/icons-material";
import axios from "axios";

function Comment({ comment, setComments }) {
  const [likes, setLikes] = useState(comment.likes.length);
  const [replies, setReplies] = useState(comment.replies);
  const [newReply, setNewReply] = useState("");
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesFetched, setRepliesFetched] = useState(false);

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3100/api/comments/like/${comment._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const commentsResponse = await axios.get(
        `http://localhost:3100/api/comments/${comment.post}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const filteredComments = commentsResponse.data.filter(
        (comment) => comment.parentComment === null
      );
      setComments(filteredComments);
      const updatedComment = commentsResponse.data.find(
        (c) => c._id === comment._id
      );
      if (updatedComment) {
        setLikes(updatedComment.likes.length);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleAddReply = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3100/api/comments/create`,
        { text: newReply, parentCommentId: comment._id, postId: comment.post },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const comments = await axios.get(
        `http://localhost:3100/api/comments/${comment.post}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(comments);
      const updatedComment = comments.data.find((c) => c._id === comment._id);
      if (updatedComment) {
        setReplies(updatedComment.replies);
      }
      setNewReply("");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <Card sx={{ mb: 1, ml: 4 }}>
      <CardContent>
        <Typography variant="body2">{comment.text}</Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike}>
          <Favorite /> {likes}
        </IconButton>
        <Button size="small" onClick={handleToggleReplies}>
          {showReplies ? "Hide Replies" : "Show Replies"}
        </Button>
      </CardActions>
      {showReplies && (
        <Box>
          {isLoadingReplies ? (
            <CircularProgress />
          ) : (
            replies.map((reply) => (
              <Box key={reply._id} sx={{ ml: 4, mb: 1 }}>
                <Typography variant="body2">{reply.text}</Typography>
              </Box>
            ))
          )}
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={1}
              variant="outlined"
              label="Reply"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddReply}>
              Reply
            </Button>
          </CardContent>
        </Box>
      )}
    </Card>
  );
}

export default Comment;
