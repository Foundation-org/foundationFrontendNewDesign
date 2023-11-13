import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

//React Router
import { BrowserRouter } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { store } from './app/store.js';

// Redux Persist
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// Tanstack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
