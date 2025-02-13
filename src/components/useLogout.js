import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Change this to your backend URL

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await axios.post(`${API_BASE_URL}/logout/`, { refresh: refreshToken });
      }

      // Remove tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return logout;
};

export default useLogout;
