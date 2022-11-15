import React, { useContext, useState } from 'react';

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  // data
  const [menu, setMenu] = useState({ isOpen: [], opened: true });
  const [message, setMessage] = useState({ open: false, message: '' });

  const settingMenu = (type, value) => {
    if (type === 'set_menu') {
      menu.opened = value;
    }
    setMenu(() => {
      return {
        ...menu,
      };
    });
  };
  const settingMessage = (type, value) => {
    message[type] = value;
    if (type === 'open' && value === false) {
      message['message'] = '';
    }

    setMessage(() => {
      return {
        ...message,
      };
    });
  };

  return (
    <AppContext.Provider value={{ menu, settingMenu, message, settingMessage }}>
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
