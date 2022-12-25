import { useState } from 'react';
// import { register } from '@/services/user';

export default () => {
  const [showLogin, setShowLoginModal] = useState(true);

  return {
    showLogin,
    setShowLoginModal,
  };
};
