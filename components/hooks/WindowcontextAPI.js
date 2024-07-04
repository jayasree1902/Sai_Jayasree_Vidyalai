import { createContext, useEffect, useState, useContext } from 'react';

const WindowContext = createContext();
export const WindowProvider = ({ children }) => {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallerDevice(width < 500);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <WindowContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowContext.Provider>
  );
};
export const useWindowWidth = () => {
  return useContext(WindowContext);
};
