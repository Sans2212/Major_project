import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate home page based on role
    return <Navigate to={user.role === 'mentee' ? '/home/mentee' : '/my-profile'} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOf(['mentee', 'mentor', null])
};

ProtectedRoute.defaultProps = {
  requiredRole: null
};

export default ProtectedRoute; 