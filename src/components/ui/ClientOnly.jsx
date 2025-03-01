import React, { useEffect, useState } from 'react';

const ClientOnly = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback;
  }

  return <>{children}</>;
};

export default ClientOnly;
