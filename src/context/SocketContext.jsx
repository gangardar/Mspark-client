// context/SocketContext.js
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  
    newSocket.on('reconnect', (attempt) => {
      console.log(`Socket reconnected after ${attempt} attempts`);
    });
  
    setSocket(newSocket);
  
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useSocket = () => useContext(SocketContext);