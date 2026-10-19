import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // cihazın sistem teması
  const [isDarkTheme, setIsDarkTheme] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  const theme = {
    isDark: isDarkTheme,
    backgroundColor: isDarkTheme ? '#1e2020' : '#dadadaff',
    textColor: isDarkTheme ? '#dadadaff' : '#000000',
    inputBackground: isDarkTheme ? '#1e2020' : '#dadadaff',
    cardBackground: isDarkTheme ? '#1e2020' : '#dadadaff',
    buttonBackground: isDarkTheme ? '#1e2020' : '#dadadaff',
  };

  // cihaz teması değişirse güncelle (isteğe bağlı)
  useEffect(() => {
    setIsDarkTheme(systemScheme === 'dark');
  }, [systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; // ✅ default export da var
