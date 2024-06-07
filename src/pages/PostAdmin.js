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
import { Link, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
const PostAdmin = () => {
  const [items, setItems] = useState([]);
  const [addId, setAddId] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addBody, setAddBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = "https://jsonplaceholder.typicode.com/posts";
        const response = await axios.get(url);
        
        const localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
        const combinedPosts = [...localPosts, ...response.data];
        const uniquePosts = combinedPosts.filter((post, index, self) => 
          index === self.findIndex((p) => p.id === post.id)
        );
        setItems(uniquePosts);
      } catch (error) {
        console.log(error);
        const localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
        setItems(localPosts);
      }
    };
    fetchPosts();
  }, []);

  const handleAddPost = () => {
    if (!addId || !addTitle || !addBody) {
      alert("All fields are required.");
      return;
    }

    const newPost = {
      id: parseInt(addId),
      title: addTitle,
      body: addBody,
    };

    const localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
    localPosts.push(newPost);
    localStorage.setItem('localPosts', JSON.stringify(localPosts));
    setItems([...items, newPost]);
    setAddId("");
    setAddTitle("");
    setAddBody("");
  };

  const handleViewDetails = (itemId) => {
    navigate(`/detail/${itemId}`);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center",padding:"2px",gap:'12px'}}>
        
        <TextField
          variant="outlined"
          margin="normal"
          label="ID"
          value={addId}
          onChange={(e) => setAddId(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          label="Title"
          value={addTitle}
          onChange={(e) => setAddTitle(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          label="Body"
          value={addBody}
          onChange={(e) => setAddBody(e.target.value)}
        />
        <CardActions>
          <Button variant="contained" size="large" color="success" onClick={handleAddPost}>
           <Add />
          </Button>
        </CardActions>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              maxWidth: "300px",
              flex: "1 1 auto",
              margin: 2,
              cursor: "pointer",
            }}
            onClick={() => handleViewDetails(item.id)}
          >
            <CardContent sx={{ textAlign: "left" }}>
              <Typography variant="h5" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body1">
                {item.body}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={`/detail/${item.id}`}
                variant="outlined"
                color="secondary"
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default PostAdmin;
