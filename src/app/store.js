import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';

// reducers
import utilsReducer from '../features/utils/utilsSlice';
import authReducer from '../features/auth/authSlice';
import filterReducer from '../features/sidebar/filtersSlice';
import bookmarkFilterReducer from '../features/filters/bookmarkFilterSlice';
import questsReducer from '../features/quest/questsSlice';
import questUtilsReducer from '../features/quest/utilsSlice';
import prefReducer from '../features/preferences/prefSlice';
import questCardReducer from '../features/quest/questCardSlice';

const persistConfig = {
  key: 'persist-store',
  version: 1,
  storage,
  whitelist: ['utils', 'auth', 'filters', 'bookmarkFilters'],
};

const reducer = combineReducers({
  utils: utilsReducer,
  auth: authReducer,
  filters: filterReducer,
  bookmarkFilters: bookmarkFilterReducer,
  quests: questsReducer,
  questUtils: questUtilsReducer,
  preferences: prefReducer,
  questCard: questCardReducer,
});

const persistedReducers = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
