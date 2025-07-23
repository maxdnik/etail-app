// lib/EtaIlContext.js
"use client"
import { createContext, useContext, useState } from 'react';

const EtaIlContext = createContext();

export const EtaIlProvider = ({ children }) => {
  const [form, setForm] = useState({});
  return (
    <EtaIlContext.Provider value={{ form, setForm }}>
      {children}
    </EtaIlContext.Provider>
  );
};
export const useEtaIl = () => useContext(EtaIlContext);
