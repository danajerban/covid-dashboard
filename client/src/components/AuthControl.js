import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function AuthControl ({ children, isLoggedIn }) {
  const navigate = useNavigate();
  // we will use isLoggedIn from the App.js so no need to check for token here
  // const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return children;
};

export default AuthControl;
