import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../context/useAuth";
import { LoadingSpinner } from "../component/common/LoadingSpinner";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, userData, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while auth status is being determined
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    // Not authenticated - redirect to login with return location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // At this point we know user is authenticated
  if (roles.length > 0) {
    // If roles are specified, check if user has required role
    const userRole = userData?.role;
    if (!userRole || !roles.includes(userRole)) {
      // Authorized but not for this role - redirect to home or unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;