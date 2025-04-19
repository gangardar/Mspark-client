import { useContext, useMemo } from 'react';
import AuthContext from './AuthContext';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const { isValid } = useContext(AuthContext);

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

  return { isValid, userData };
};

export default useAuth;
