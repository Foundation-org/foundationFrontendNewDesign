import { configureStore } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';

// reducers
import todoReducer from '../features/todo/todoSlice';
import utilsReducer from '../features/utils/utilsSlice';
import authReducer from '../features/auth/authSlice';
import filterReducer from '../features/filters/filtersSlice';
import questsReducer from '../features/quest/questsSlice';

const persistConfig = {
  key: 'persist-store',
  version: 1,
  storage,
  whitelist: ['utils', 'auth', 'filters'],
};

const reducer = combineReducers({
  utils: utilsReducer,
  auth: authReducer,
  filters: filterReducer,
  quests: questsReducer,
  todo: todoReducer,
});

const persistedReducers = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducers,
});
