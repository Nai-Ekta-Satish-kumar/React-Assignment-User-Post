import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = 'https://jsonplaceholder.typicode.com/posts';
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(url);
  return response.data;
});

export const addPost = createAsyncThunk('posts/addPost', async (post) => {
  const response = await axios.post(url, post);
  return response.data;
});
export const editPost = createAsyncThunk('posts/editPost', async (post) => {
  const response = await axios.put(`${url}/${post.id}`, post);
  return response.data;
});
export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
  await axios.delete(`${url}/${postId}`);
  return postId;
});
export const addComment = createAsyncThunk('posts/addComment', async ({ postId, comment }) => {
  const response = await axios.post(`${url}/${postId}/comments`, { body: comment });
  return { postId, comment: response.data.body };
});
const initialState = {
  items: JSON.parse(localStorage.getItem('posts')) || [],
  status: 'idle',
  error: null
};
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        localStorage.setItem('posts', JSON.stringify(state.items));
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
        localStorage.setItem('posts', JSON.stringify(state.items));
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.items.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
          localStorage.setItem('posts', JSON.stringify(state.items));
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(post => post.id !== action.payload);
        localStorage.setItem('posts', JSON.stringify(state.items));
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.items.find(post => post.id === action.payload.postId);
        if (post) {
          post.comments = post.comments ? [...post.comments, action.payload.comment] : [action.payload.comment];
          localStorage.setItem('posts', JSON.stringify(state.items));
        }
      });
  }
});

export default postsSlice.reducer;
