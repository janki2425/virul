export const BACKEND_URL = "https://27b4-122-173-64-102.ngrok-free.app";

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
    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    return { message: "Error registering user", error: error instanceof Error ? error.message : "Unknown error" };
  }
};

