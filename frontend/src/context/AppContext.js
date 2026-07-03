import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('tc_lang') || 'tr');
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tc_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === 'tr' ? 'en' : 'tr'));

  return (
    <AppContext.Provider value={{ lang, setLang, toggleLang, aiOpen, setAiOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
