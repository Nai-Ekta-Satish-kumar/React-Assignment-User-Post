import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, addPost, deletePost, editPost, addComment } from '../redux/reducer/PostsSlice';
import { Card, CardContent, Box, Typography, Button, TextField, Modal } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Comment as CommentIcon, Save as SaveIcon } from '@mui/icons-material';

const Post = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.posts.items);
  const [editItem, setEditItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts'));
    if (storedPosts) {
      dispatch({ type: 'posts/fetchPosts/fulfilled', payload: storedPosts });
    } else {
      dispatch(fetchPosts());
    }
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditBody(item.body);
    setOpen(true);
  };

  const handleUpdate = () => {
    if (editItem && editItem.id) {
      const updatedPost = { id: editItem.id, title: editTitle, body: editBody };
      let storedPosts = JSON.parse(localStorage.getItem('posts'));
      storedPosts = storedPosts.map(post => post.id === updatedPost.id ? updatedPost : post);
      localStorage.setItem('posts', JSON.stringify(storedPosts));
      dispatch({ type: 'posts/editPost/fulfilled', payload: updatedPost });
      setOpen(false);
    } else {
      console.error('Edit item ID is missing');
    }
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    const uniqueId = Date.now();  // Generate a unique ID based on the current timestamp
    const newPostData = { id: uniqueId, title: newPost.title, body: newPost.body };
    let storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    storedPosts.push(newPostData);
    localStorage.setItem('posts', JSON.stringify(storedPosts));
    dispatch({ type: 'posts/addPost/fulfilled', payload: newPostData });
    setNewPost({ title: '', body: '' });
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText.trim()) return;
    dispatch(addComment({ postId, comment: commentText }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setShowCommentInput(prev => ({ ...prev, [postId]: false }));
  };

  const handleCommentButtonClick = (postId) => {
    setShowCommentInput(prev => ({ ...prev, [postId]: true }));
  };

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.map(user => user.name);

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
                {item.comments && item.comments.map((comment, index) => (
                  <Typography key={index} variant="body1" color="textSecondary">{user}:{comment}</Typography>
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
