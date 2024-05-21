import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Typography, Button, TextField, Modal, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
const Post = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ id: '', title: '', body: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://jsonplaceholder.typicode.com/posts";
        const response = await axios.get(url);
        setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditBody(item.body);
    setOpen(true);
  };

  const handleUpdate = () => {
    const updatedItems = items.map(item => 
      item.id === editItem.id ? { ...item, title: editTitle, body: editBody } : item
    );
    setItems(updatedItems);
    setOpen(false);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    const newItems = [...items, { ...newPost }];
    setItems(newItems);
    setNewPost({ id: '', title: '', body: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <form onSubmit={handleAddPost} style={{ marginBottom: '20px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="ID"
            value={newPost.id}
            onChange={(e) => setNewPost({ ...newPost, id: e.target.value })}
          />
          <TextField
            label="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            label="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Button type="submit" variant="contained" color="secondary">
           <AddIcon />
          </Button>
        </Box>
      </form>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map((item) => (
          <Card key={item.id} sx={{ flex: '1 1 300px', margin: 2 }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {item.id}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography gutterBottom variant="body2" component="div">
                <div className='container'>{item.body}</div>
              </Typography>
              <Grid
                        container
                        spacing={0}
                        justifyContent="center"
                        
                      >
                         <Grid item xs={2} md={3}>
              <Button sx={{marginLeft:'150px' ,marginBottom:'auto',}} variant="outlined" color="primary" onClick={() => handleEdit(item)}>
             <EditIcon />
              </Button></Grid>
             
              <Grid item xs={1}>
              <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)}>
              <DeleteIcon/>
              </Button></Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4 
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Edit Post
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Body"
            multiline
            rows={4}
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Post;
