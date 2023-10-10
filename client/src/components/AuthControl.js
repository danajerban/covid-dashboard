import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function AuthControl ({ children, isLoggedIn }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return children;
};

export default AuthControl;
