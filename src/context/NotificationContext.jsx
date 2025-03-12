import React, { createContext, useState, useContext } from "react";

// Create the context
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to increment the notification count
  const incrementUnreadCount = () => {
    setUnreadCount((prevCount) => prevCount + 1);
  };

  // Function to decrement the notification count
  const decrementUnreadCount = () => {
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
  };

  // Function to reset the notification count
  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ unreadCount, incrementUnreadCount, decrementUnreadCount, resetUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};