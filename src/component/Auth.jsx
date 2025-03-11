/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Button,
  Modal,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Register from "./Register";
import Login from "./login";
import Logout from "./Logout";
import AuthContext from "../context/AuthContext";
import MiniProfile from "./MiniProfile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Auth = () => {
  const [loginModal, setLoginModal] = useState(false);

  const toggleLoginModal = () => setLoginModal(!loginModal);
  const [activeTab, setActiveTab] = useState(0);
  const{isValid, login, logout} = useContext(AuthContext)

    // Check token validity on component mount and whenever the token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const expirationTime = decoded.exp * 1000; // Convert to milliseconds
                if (Date.now() < expirationTime) {
                    login(); // Token is valid
                } else {
                    logout(); // Token is expired
                    localStorage.removeItem('token'); // Remove expired token
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                logout(); // Token is invalid
                localStorage.removeItem('token'); // Remove invalid token
            }
        } else {
            logout(); // No token found
        }
    }, []);

    const handleLogout = () => {
      localStorage.removeItem("token"); // Remove token
      logout();
    };


  return (
    <>
    {
      (!isValid.status) ?(
        <Button onClick={toggleLoginModal} variant="text">
        Login
      </Button>
      ):
      (

        <MiniProfile/>
      )
      
    }
    
      

      {/* Login and Register modal */}
      <Modal
        open={loginModal}
        onClose={toggleLoginModal}
        aria-labelledby="login modal"
        aria-describedby="login to the mspark paltform"
      >
        <Box sx={style}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {activeTab === 0 && (
            <Login onSuccess={() => setLoginModal(false)} />
          )}

          {activeTab === 1 && (
            <Register role="merchant"/>
          )}

          
        </Box>
      </Modal>
    </>
  );
};

export default Auth;
