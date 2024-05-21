import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Typography, Button, TextField, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import SaveIcon from '@mui/icons-material/Save';

const Post = () => {
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://jsonplaceholder.typicode.com/posts";
        const response = await axios.get(url);
        setItems(response.data);
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
    setNewPost({  title: '', body: '' });
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText.trim()) return;

    setComments(prevComments => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), commentText]
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setShowCommentInput(prev => ({ ...prev, [postId]: false }));
  };

  const handleCommentButtonClick = (postId) => {
    setShowCommentInput(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <form onSubmit={handleAddPost} style={{ marginBottom: '20px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          <Card key={item.id} sx={{ flex: '1 1 300px', margin: 2, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                <strong>{item.title}</strong>
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                <div className='container'>{item.body}</div>
              </Typography>
              <Box mt={2}>
                {comments[item.id] && comments[item.id].map((comment, index) => (
                  <Typography key={index} variant="body2" color="textSecondary">{comment}</Typography>
                ))}
                {showCommentInput[item.id] && (
                  <Box mt={1} display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Add a comment"
                      value={commentInputs[item.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <Button onClick={() => handleAddComment(item.id)} variant="contained" color="primary" sx={{ ml: 1 }}>
                      <AddIcon />
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderTop: '1px solid #ddd' }}>
              <Button variant="outlined" color="primary" onClick={() => handleCommentButtonClick(item.id)}>
                <CommentIcon />
              </Button>
              <Button variant="outlined" color="primary" onClick={() => handleEdit(item)}>
                <EditIcon />
              </Button>
              <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)}>
                <DeleteIcon />
              </Button>
            </Box>
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
            <SaveIcon />
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Post;
