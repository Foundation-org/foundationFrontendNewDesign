import { configureStore } from '@reduxjs/toolkit';

// reducers
import todoReducer from '../features/todo/todoSlice';

export const store = configureStore({
  reducer: todoReducer,
});
