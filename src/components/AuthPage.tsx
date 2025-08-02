import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <>
      {isLoginMode ? (
        <Login onSwitchToSignup={() => setIsLoginMode(false)} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLoginMode(true)} />
      )}
    </>
  );
};

export default AuthPage;
