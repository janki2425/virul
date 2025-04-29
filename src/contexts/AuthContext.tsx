import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/pages/api/axiosInstance';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

// Define types
interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  isPending: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create default context state
const defaultContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isPending: false,
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {}
};



// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

//fetch user data function for useQuery
const fetchUserData = async(): Promise<UserType>=>{
  const token = localStorage.getItem('token');
  if(!token){
    throw new Error('No token found');
  }
  const response = await axiosInstance.get('/api/user');

  const userData: UserType = response.data.user;
  if (!userData.id || !userData.first_name || !userData.last_name) {
    throw new Error('Invalid user data');
  }
  return userData;
}

//login finction for useMutation
const loginUser = async({email,password}:{email:string;password:string})=>{
  const response=await axiosInstance.post('/api/login',{email,password});
  if(!response.data.token){
    throw new Error(response.data.error || 'Login failed');
  }
  return response.data.token;
}

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');


  const { data, isPending, error: queryError, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    enabled: hasToken,
    retry: false,
  });
  
  useEffect(() => {
    if (isError && queryError) {
      const responseData = (queryError as AxiosError<ApiErrorResponse>).response?.data;
      const errorMessage = responseData?.message || responseData?.error || queryError.message;
  
      if (queryError.message === 'No token found' || responseData?.error === 'Invalid token') {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        router.push('/auth/Login');
      } else {
        setError(`Authentication error: ${errorMessage}`);
      }
    }
  }, [isError, queryError, router]);

  const user: UserType | null = data ?? null;
  const isLoggedIn = !!user;
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn:loginUser,
    onSuccess:(token)=>{
      localStorage.setItem('token', token);
      console.log("has token");
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/');
    },
    onError:(err:AxiosError<ApiErrorResponse>)=>{
      const responseData = err.response?.data;
      const errorMessage = responseData?.message || responseData?.error || err.message;
      setError(errorMessage || 'Login failed');
      console.log("no token");
      
    },
  });
  
  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    await loginMutation.mutateAsync({ email, password });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['user'], null); 
    queryClient.removeQueries({ queryKey: ['user'] });
    setError(null);
    router.push('/').then(() => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    });
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const isBrowser = typeof window !== 'undefined';
  

useEffect(() => {
  if (!isBrowser) return;

  if (!hasToken) {
    queryClient.setQueryData(['user'], null); 
  }
}, [hasToken, queryClient]);


  const value: AuthContextType = {
    user,
    isLoggedIn,
    isPending:isPending || loginMutation.isPending,
    error: error || (queryError?.message || null),
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};