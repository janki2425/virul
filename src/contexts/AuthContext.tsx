// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import { BACKEND_URL } from '@/pages/api/auth/auth';

// // Define types
// interface UserType {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email?: string;
// }

// interface AuthContextType {
//   user: UserType | null;
//   isLoggedIn: boolean;
//   isLoading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   clearError: () => void;
// }

// // Create default context state
// const defaultContextValue: AuthContextType = {
//   user: null,
//   isLoggedIn: false,
//   isLoading: false, // Start as false for first-time users
//   error: null,
//   login: async () => {},
//   logout: () => {},
//   clearError: () => {}
// };

// // Create the context
// const AuthContext = createContext<AuthContextType>(defaultContextValue);

// // Create provider component
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // Only load when needed
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // Function to fetch user data
//   const fetchUserData = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/user`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'ngrok-skip-browser-warning': 'true',
//         },
//       });
//       if (response.data.user) {
//         setUser(response.data.user);
//         setIsLoggedIn(true);
//       } else {
//         setError('Invalid API response format.');
//       }
//     } catch (err: any) {
//       console.error('Auth error:', err.response?.data);
//       if (err.response?.data?.error === 'Invalid token') {
//         localStorage.removeItem('token');
//         setError('Session expired. Please log in again.');
//         router.push('/auth/Login');
//       } else {
//         setError(`Authentication error: ${err.response?.data?.message || err.message}`);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Login function
//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/login`, { email, password });
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         await fetchUserData();
//         router.push("/");
//       } else {
//         throw new Error(response.data.error || 'Login failed');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Login failed');
//       setIsLoading(false);
//       throw err;
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setIsLoggedIn(false);
//     router.push('/');
//   };

//   // Clear error
//   const clearError = () => {
//     setError(null);
//   };

//   const isBrowser = typeof window !== 'undefined';
  
// const [hasTriedLogin, setHasTriedLogin] = useState(false);

// useEffect(() => {
//   if (!isBrowser) return;

//   const token = localStorage.getItem('token');

//   if (token) {
//     if (hasTriedLogin) {
//       fetchUserData();
//     } else {
//       setIsLoading(false); 
//     }
//   } else {
//     setIsLoading(false);
//     setUser(null);
//     setIsLoggedIn(false);
//   }

//   const handleStorageChange = (e: StorageEvent) => {
//     if (e.key === 'token') {
//       if (e.newValue) {
//         setHasTriedLogin(true);
//         fetchUserData();
//       } else {
//         setUser(null);
//         setIsLoggedIn(false);
//         setIsLoading(false);
//       }
//     }
//   };

//   window.addEventListener('storage', handleStorageChange);
//   return () => window.removeEventListener('storage', handleStorageChange);
// }, [hasTriedLogin]); // Adding hasTriedLogin as dependency to control fetchUserData

  

//   // Set up axios interceptor for token handling
//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       response => response,
//       error => {
//         if (error.response?.status === 401) {
//           if (error.response.data?.error === 'Invalid token') {
//             localStorage.removeItem('token');
//             setUser(null);
//             setIsLoggedIn(false);
//             router.push('/auth/Login');
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => axios.interceptors.response.eject(interceptor);
//   }, [router]);

//   const value = {
//     user,
//     isLoggedIn,
//     isLoading,
//     error,
//     login,
//     logout,
//     clearError,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook for using the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/pages/api/axiosInstance';
import { useRouter } from 'next/router';
import { BACKEND_URL } from '@/pages/api/auth/auth';

// Define types
interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create default context state
const defaultContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isLoading: false, // Start as false for first-time users
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {}
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Only load when needed
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/api/user`);
      console.log("user data : ",response.data.user);
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsLoggedIn(true);
      } else {
        setError('Invalid API response format.');
      }
    } catch (err: any) {
      console.error('Auth error:', err.response?.data);
      if (err.response?.data?.error === 'Invalid token') {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        router.push('/auth/Login');
      } else {
        setError(`Authentication error: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`${BACKEND_URL}/api/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        await fetchUserData();
        router.push("/");
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed');
      setIsLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    router.push('/');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const isBrowser = typeof window !== 'undefined';
  
const [hasTriedLogin, setHasTriedLogin] = useState(false);

useEffect(() => {
  if (!isBrowser) return;

  const token = localStorage.getItem('token');

  if (token) {
    if (hasTriedLogin) {
      fetchUserData();
    } else {
      setIsLoading(false); 
    }
  } else {
    setIsLoading(false);
    setUser(null);
    setIsLoggedIn(false);
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'token') {
      if (e.newValue) {
        setHasTriedLogin(true);
        fetchUserData();
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [hasTriedLogin]);  


  const value = {
    user,
    isLoggedIn,
    isLoading,
    error,
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