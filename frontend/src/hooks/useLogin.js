import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
const handleInputError = (email, password) => {
  if (!email || !password) {
    toast.error("All feilds are required");
    return true;
  }
  return false;
};
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthuser } = useAuthContext();
  const login = async (email, password) => {
    const checkError = handleInputError(email, password);
    if (checkError) {
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("user", JSON.stringify(data));
      setAuthuser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, login };
};
export default useLogin;
