
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../reducer/PostsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});
