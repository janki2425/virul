import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </QueryClientProvider>
    </AuthProvider>
  );
}
