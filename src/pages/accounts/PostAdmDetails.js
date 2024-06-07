import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";

const PostAdmDetails = () => {
  const [DAta, setDAta] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setnewComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [IsEdited, setIsEdited] = useState(false);
  const [title, setTitle] = useState("");
  const [addId,setAddId] = useState('')
  const [body, setBody] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
        const localPost = localPosts.find(post => post.id === parseInt(id));
        
        if (localPost) {
          setDAta(localPost);
          setAddId(localPost.id);
          setTitle(localPost.title);
          setBody(localPost.body);
        } else {
          const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
          const response = await axios.get(url);
          setDAta(response.data);
          setAddId(response.data.id);
          setTitle(response.data.title);
          setBody(response.data.body);
          // console.log(response.data);
        }
     
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim === "") return;
    setComments([...comments, newComment]);
    setnewComment("");
    setShowComment(false);
  };

  const handleShowComment = () => {
    setShowComment(!showComment);
  };

  const handleDelete = (postId) => {
    if (DAta) {
      const localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
      const updatedLocalPosts = localPosts.filter(post => post.id !== postId);
      localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
      setDAta(null);
      console.log("Deleted item with id:", postId);
    }
  };

  const handleEdit = () => {
    setIsEdited(!IsEdited);
  };

  const handleSave = async () => {
    try {
      const updatedItem = { id: addId, title, body };


      const localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
      const updatedLocalPosts = localPosts.map(post =>
        post.id === DAta.id ? updatedItem : post
      );
      localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));

      setDAta(updatedItem);
      setIsEdited(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2" }}>
        {DAta ? (
          <Card key={DAta.id} sx={{ maxWidth: "30%" }}>
            {IsEdited ? (
              <Box>
                <Typography>Edit post</Typography>
                <TextField
                  value={addId}
                  label="Id"
                  onChange={(e) => setAddId(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  value={title}
                  label="title"
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  value={body}
                  label="body"
                  onChange={(e) => setBody(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <CardActions>
                  <Button onClick={handleSave}>save</Button>
                </CardActions>
              </Box>
            ) : (
              <>
                <Typography variant="h4">{DAta.title}</Typography>
                <CardContent>
                  <Typography variant="body">{DAta.body}</Typography>
                  
                  <CardActions>
                    <Box
                      sx={{
                        display: "flex",
                       justifyContent: "space-between",
                        padding: "2px",
                        gap:"17px",
                        borderTop: "1px solid",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleShowComment}
                      >
                        <CommentIcon />
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleEdit}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleDelete(DAta.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </CardActions>
                  {
                    comments.map((comment, index) => (
                      <Typography key={index} variant="body2" sx={{ marginTop: 1 }}>
                        {comment}
                      </Typography>
                    ))
                  }
                  {showComment && 
                  <>
                    <TextField 
                      label={'Add new comment'}
                      onChange={(e)=> setnewComment(e.target.value)}
                      value={newComment}
                    />
                    <CardActions>
                      <Button variant="outlined" onClick={handleAddComment}>
                        save comment
                      </Button>
                    </CardActions>
                  </>}
                </CardContent>
              </>
            )}
          </Card>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}
      </Box>
    </div>
  );
};

export default PostAdmDetails;
