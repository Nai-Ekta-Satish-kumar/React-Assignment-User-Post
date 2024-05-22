import { Box, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlinePhone } from "react-icons/ai";
import { BsGlobe2 } from "react-icons/bs";
import {  MdOutlineMail } from "react-icons/md";
const UserList = () => {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://jsonplaceholder.typicode.com/users";
        const response = await axios.get(url);
        setItems(response.data);
      } catch (error) {
      }
    };
    fetchData();
  }, []);
  const handleCardClick = async (userId) => {
    setLoading(true);
    setOpen(true);
    try {
      const [albumsResponse, todosResponse] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/users/${userId}/albums`),
        axios.get(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
      ]);
      setAlbums(albumsResponse.data);
      setTodos(todosResponse.data);

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const handleClose = () => {
    setOpen(false);
    setAlbums([]);
    setTodos([]);
  };
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 2 }}>
      {items.map((item) => (
        <Card key={item.id} sx={{ flex: '1 1 300px', margin: 2 }} onClick={() => handleCardClick(item.id)}>
          <CardContent sx={{ textAlign: 'left' }}>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography gutterBottom variant="title" component="div">
              <div><strong>User name:</strong> {item.username}</div>
            </Typography>
            <Typography gutterBottom variant="title" component="div">
              <div><AiOutlinePhone /> {item.phone}</div>
            </Typography>
            <Typography gutterBottom variant="title" component="div">
              <div><MdOutlineMail /> {item.email}</div>
            </Typography>
            <Typography gutterBottom variant="title" component="div">
              <div><BsGlobe2 /> {item.website}</div>
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              <Typography variant="h6" component="div"><strong>Address:</strong></Typography>
              <div>Street: {item.address.street}</div>
              <div>Suite: {item.address.suite}</div>
              <div>City: {item.address.city}</div>
              <div>Zipcode: {item.address.zipcode}</div>
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              <Typography variant="h6" component="div"><strong>Company:</strong></Typography>
              <div>name: {item.company.name}</div>
              <div>catchPhrase: {item.company.catchPhrase}</div>
              <div>bs: {item.company.bs}</div>
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><Typography variant="h4" sx={{ marginTop: 2 }}>User Details</Typography></DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h6"><strong> Albums:</strong></Typography>
              <List>
                {albums.map((album) => (
                  <ListItem key={album.id}>
                    <ListItemText primary={album.title} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" sx={{ marginTop: 2 }}><strong>Todos:</strong></Typography>
              <List>
                {todos.map((todo) => (
                  <ListItem key={todo.id}>
                    <ListItemText primary={todo.title} secondary={todo.completed ? 'Completed' : 'Pending'} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default UserList;
