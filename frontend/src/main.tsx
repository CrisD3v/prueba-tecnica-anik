import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';

// Crear instancia del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Solo reintentar una vez
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false, // No refrescar al enfocar ventana
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position='top-center' richColors/>
    </QueryClientProvider>
  </StrictMode>,
);
