import { useContext, useMemo } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { isValid, isLoading } = useContext(AuthContext);

  const userData = useMemo(() => {
    if (isValid?.status && isValid.token) {
      try {
        return jwtDecode(isValid.token);
      } catch {
        return null;
      }
    }
    return null;
  }, [isValid]);

  return {
    isAuthenticated: isValid?.status || false,
    isValid,
    userData,
    isLoading,
    token: isValid?.token || null,
  };
};

export default useAuth;
