export const BACKEND_URL = "https://e413-2401-4900-5047-50b9-1500-9254-60f2-170a.ngrok-free.app";
import axiosInstance from "../axiosInstance";

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token?: string;
  error?: string;
}


export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/api/register", userData);
    console.log("user register data : ",response.data);
    
    return response.data;
    
  } catch (error:any) {
    return {
      message: "Error registering user",
      error: error.response?.data?.message || error.message || "Unknown error",
    };
  }
};


export const forgetPassword = async ({ email }: { email: string }) => {
  const res = await axiosInstance.post<AuthResponse>(`api/forget-password`,{email});
  return res.data;
};

export const resetPassword = async (data: {
  otp: string;
  password: string;
  confirmPassword: string;
}) => {
  const res = await axiosInstance.post<AuthResponse>(`api/reset-password?reset_password_otp=${data.otp}`,
    {
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    }
  );
  return res.data;
};