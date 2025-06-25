import React, { createContext, useContext, useState } from 'react';

const ParentPortalContext = createContext<any>(null);

export const ParentPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portalData, setPortalData] = useState<any>(null);
  return (
    <ParentPortalContext.Provider value={{ portalData, setPortalData }}>
      {children}
    </ParentPortalContext.Provider>
  );
};

export const useParentPortal = () => useContext(ParentPortalContext); 