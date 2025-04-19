import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../context/useAuth";
import { LoadingSpinner } from "../component/common/LoadingSpinner";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isValid, userData } = useAuth();
  const location = useLocation();

  if (isValid === undefined) {
    // Auth state not yet determined
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!isValid?.status || !userData) {
    // Not authenticated - redirect to login with return location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(userData.role)) {
    // Authorized but not for this role - redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;