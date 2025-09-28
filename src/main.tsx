import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initOpenAPI } from '@/lib/openapi-config';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

initOpenAPI();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus (you can enable if you want auto-refresh)
      refetchOnWindowFocus: false,
      retry: 1, // retry failed requests once
      staleTime: 1000 * 60 * 5, // 5 minutes considered "fresh"
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
