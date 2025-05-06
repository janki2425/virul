import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/pages/api/axiosInstance';
import {useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {jwtDecode} from 'jwt-decode'
import { UserType } from '@/utils/types';
import { ApiErrorResponse } from '@/utils/types';
import { BookmarkType } from '@/utils/types';
import { AuthContextType } from '@/utils/types';
import { JwtPayload } from '@/utils/types';


// Create default context state
const defaultContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isPending: false,
  error: null,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
  bookmarkedEvents: [],
  toggleBookmark: async () => {},
  isBookmarked: () => false,
  suggestedEvents: [],
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
  localStorage.setItem('userId', userData.id);
  return userData;
}

//login function for useMutation
const loginUser = async({email,password}:{email:string;password:string})=>{
  const response=await axiosInstance.post('/api/login',{email,password});
  const { token } = response.data;
  if (!token) {
    throw new Error(response.data.error || 'Login failed');
  }
  const decodedToken = jwtDecode<JwtPayload>(token);


  const user: UserType = {
    id: decodedToken.id,
    first_name: decodedToken.first_name,
    last_name: decodedToken.last_name,
    email: decodedToken.email,
  };


  return { token, user };
}

const fetchBookmarkedEvents = async (): Promise<BookmarkType[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const uset_id = localStorage.getItem('userId');
  if (!uset_id) {
    throw new Error('No user ID found');
  }
  try {
    const response = await axiosInstance.get(`/api/bookmarks?user_id=${uset_id}`);
    // console.log('Bookmark API response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data.bookmarkedEvents && Array.isArray(data.bookmarkedEvents)) {
      return data.bookmarkedEvents;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error fetching bookmarked events:', err);
    throw err;
  }
};

const toggleBookmarkMutationFn = async ({ event_id, uset_id, isBookmarked }: { event_id: string; uset_id: string; isBookmarked: boolean }) => {
  if (isBookmarked) {
    await axiosInstance.delete(`/api/bookmarks/event?user_id=${uset_id}&event_id=${event_id}`);
    return { uset_id, event_id, action: 'removed' };
  } else {
    try {
      const response = await axiosInstance.post('/api/bookmarks', { event_id, uset_id });
      return { event_id, uset_id, action: 'added', bookmark: response.data };
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response?.data?.message?.includes('already bookmarked')) {
        await axiosInstance.delete(`/api/bookmarks/event?user_id=${uset_id}&event_id=${event_id}`);
        return { uset_id, event_id, action: 'removed' };
      }
      throw err;
    }
  }
};

const fetchSuggestedEvents = async (): Promise<BookmarkType[]>=>{
  const token = localStorage.getItem('token');
  if(!token){
    throw new Error('No token found');
  }
  const user_id = localStorage.getItem('userId');
  if(!user_id){
    throw new Error('No user ID found');
  }
  try{
    const response = await axiosInstance.get(`/api/events/suggestions?user_id=${user_id}`);
    // console.log('Suggested Events API response:', response.data);
    const data=response.data;
    if (data.suggestedEvents && Array.isArray(data.suggestedEvents)){
      return data.suggestedEvents;
    }else{
      return [];  
    }
  }catch(err){
    console.log('Error fetching suggested events:', err);
    return [];
  }
}

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');


  const { data:userData, isPending: isUserPending, error: queryError, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    enabled: hasToken,
    retry: false,
  });

  const { data: bookmarkedEventsData, isPending: isBookmarksPending, error: bookmarkError } = useQuery<BookmarkType[]>({
    queryKey: ['bookmarkedEvents'],
    queryFn: fetchBookmarkedEvents,
    enabled: hasToken && !!userData,
    retry: false,
    initialData:[],
  });

  const {data:suggestedEventsData, isPending:isSuggestedPending,
    error:suggestedError
  } = useQuery<BookmarkType[]>({
    queryKey:['suggestedEvents'],
    queryFn:fetchSuggestedEvents,
    enabled:hasToken && !!userData,
    retry:false,
    initialData:[],
  });

  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<BookmarkType[]>([]);
  const [suggestedEvents, setSuggestedEvents] = useState<BookmarkType[]>([]);
  const isLoggedIn = !!user;

  const loginMutation = useMutation({
    mutationFn:loginUser,
    onSuccess:async({token,user})=>{
      // console.log('Login successful:', { token, user });
      setError(null);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      setUser(user); 
      queryClient.setQueryData(['user'], user);
      await router.push('/');
    },
    onError:(err:AxiosError<ApiErrorResponse>)=>{
      // console.error('Login error details:', err.response?.data, err.message); 
      const responseData = err.response?.data;
      const errorMessage = responseData?.message || responseData?.error || err.message;
      setError(errorMessage || 'Login failed');
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: toggleBookmarkMutationFn,
    onMutate: async ({ event_id, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarkedEvents'] });
      const previousBookmarks = queryClient.getQueryData<BookmarkType[]>(['bookmarkedEvents']);
      queryClient.setQueryData(['bookmarkedEvents'], (old: BookmarkType[] | undefined) => {
        const currentBookmarks = Array.isArray(old) ? old : [];
        if (isBookmarked) {
          return currentBookmarks.filter((bookmark) => bookmark.id !== event_id);
        } else {
          return [...currentBookmarks, { id: event_id, name: 'Loading...', category: '', short_description: '', image_url: '', start_date: '', address: '', city: '', price: 0 }];
        }
      });
      return { previousBookmarks };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['bookmarkedEvents'], context?.previousBookmarks);
      const responseData = (err as AxiosError<ApiErrorResponse>).response?.data;
      const errorMessage = responseData?.message || responseData?.error || err.message;
      console.error('Toggle bookmark error:', errorMessage);
      setError(errorMessage || 'Failed to toggle bookmark');
    },
    onSuccess: async(data) => {
      if (data.action === 'added' && data.bookmark) {
        queryClient.setQueryData(['bookmarkedEvents'], (old: BookmarkType[] | undefined) =>{
        const currentBookmarks = Array.isArray(old) ? old : [];
        return currentBookmarks.map((b) => (b.id === data.event_id ? data.bookmark : b));
        });
        setBookmarkedEvents((prev) =>
          prev.map((b) => (b.id === data.event_id ? data.bookmark : b))
        );
      }
      else if (data.action === 'removed') {
        const updatedBookmarks = await fetchBookmarkedEvents().catch((err) => {
          console.error('Error refetching bookmarks:', err);
          return [];
        });
        queryClient.setQueryData(['bookmarkedEvents'], updatedBookmarks);
        setBookmarkedEvents(updatedBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEvents'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedEvents'] });
    },
  });
  
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (bookmarkedEventsData && Array.isArray(bookmarkedEventsData)) {
      setBookmarkedEvents(bookmarkedEventsData);
    } else {
      setBookmarkedEvents([]);
    }
  }, [bookmarkedEventsData]);

  useEffect(()=>{
    if(suggestedEventsData && Array.isArray(suggestedEventsData)){
      setSuggestedEvents(suggestedEventsData);
    }else {
      setSuggestedEvents([]);
    }
  }, [suggestedEventsData])

  useEffect(() => {
    if (isError && queryError) {
      const responseData = (queryError as AxiosError<ApiErrorResponse>).response?.data;
      const errorMessage = responseData?.message || responseData?.error || queryError.message;

      if (queryError.message === 'No token found' || responseData?.error === 'Invalid token') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setError('Session expired. Please log in again.');
        router.push('/auth/Login');
      } else {
        setError(`Authentication error: ${errorMessage}`);
      }
    }
  }, [isError, queryError, router]);
  

  useEffect(() => {
    if (!hasToken) {
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['bookmarkedEvents'], null);
      setBookmarkedEvents([]);
    }
  }, [hasToken, queryClient]);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    await loginMutation.mutateAsync({ email, password });
  };

    
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    setUser(null);
    setError(null);

    queryClient.setQueryData(['user'], null);
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.setQueryData(['bookmarkedEvents'], []);
    queryClient.removeQueries({ queryKey: ['bookmarkedEvents'] });
      
    router.push('/').then(() => {
      // queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEvents'] });
    });
    
  };

    // Clear error
    const clearError = () => {
      setError(null);
    };

    const toggleBookmark = async (event_id: string) => {
      if (!isLoggedIn) {
        setError('Please log in to bookmark events');
        router.push('/auth/Login');
        return;
      }
      if (!user || !user.id) {
        setError('User ID not found');
        return;
      }
      setError(null);
      const isCurrentlyBookmarked = isBookmarked(event_id);
      // console.log(`Toggling bookmark for event ${event_id}, currently bookmarked: ${isCurrentlyBookmarked}`);
      await toggleBookmarkMutation.mutateAsync({ event_id, uset_id: user.id, isBookmarked: isCurrentlyBookmarked });
    };

    // Check if event is bookmarked
    const isBookmarked = (event_id: string) => {
      const result = Array.isArray(bookmarkedEvents) ? bookmarkedEvents.some((bookmark) => bookmark.id === event_id) : false;
      return result;
    };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isPending:isUserPending || loginMutation.isPending || isBookmarksPending,
    error: error || (queryError?.message || null),
    login,
    logout,
    clearError,
    bookmarkedEvents,
    toggleBookmark,
    isBookmarked,
    suggestedEvents,
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