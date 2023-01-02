import { useState } from 'react';
// import { register } from '@/services/user';

export default () => {
  const [showLogin, setShowLoginModal] = useState(false);

  return {
    showLogin,
    setShowLoginModal,
  };
};
