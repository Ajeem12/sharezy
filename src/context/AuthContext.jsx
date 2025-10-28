// Assuming you are using axios and React Context
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    // For regular user session
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    // For admin session
    const storedAdminToken = localStorage.getItem("admintoken");
    const storedAdminUser = localStorage.getItem("adminuser");

    if (storedAdminToken) setAdminToken(storedAdminToken);
    if (storedAdminUser) setAdmin(JSON.parse(storedAdminUser));

    setIsInitializing(false);
  }, []);

  // Regular User Login Logic
  const requestLogin = async (mobile) => {
  try {
    const response = await axios.post(`${apiUrl}/userlogin`, { mobile });
    
    // Store mobile number in localStorage for OTP
    localStorage.setItem("mobile", mobile);

    return { success: true };
  } catch (error) {
    // Handle different types of errors
    let message = "Login initiation failed.";
    
    if (error.response) {
      // The request was made and the server responded with a status code
      message = error.response.data.error || error.response.data.message || message;
    } else if (error.request) {
      // The request was made but no response was received
      message = "No response from server. Please try again.";
    } else {
      // Something happened in setting up the request
      message = error.message;
    }

    return { success: false, message };
  }
};

  const verifyOtp = async (otp) => {
    try {
      const mobile = localStorage.getItem("mobile"); // Get stored mobile number

      const response = await axios.post(`${apiUrl}/verifyOtp`, {
        mobile,
        otp,
      });

      const { token, name, role,login } = response.data.data;
      const user = { name, role };

      setToken(token);
      setUser(user);

      // Store user info in localStorage
      localStorage.setItem("token", token);
       localStorage.setItem("login", login);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed.";
      return { success: false, message };
    }
  };

  // Admin Login Logic
  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/adminlogin`, {
        email,
        password,
      });

      const { token, name,  } = response.data.data;

      // Store admin token and user info separately
      setAdminToken(token);
      setAdmin({ name });

      // Store admin data in localStorage
      localStorage.setItem("admintoken", token);
      localStorage.setItem("adminuser", JSON.stringify({ name }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Admin login failed.";
      return { success: false, message };
    }
  };

 
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("mobile");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("login"); 
  };

  // Admin Logout
  const adminLogout = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem("admintoken");
    localStorage.removeItem("adminuser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        admin,
        adminToken,
        requestLogin,
        verifyOtp,
        logout,
        adminLogin,
        adminLogout,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
