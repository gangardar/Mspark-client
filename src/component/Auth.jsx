/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Modal, Tab,
  Tabs
} from "@mui/material";
import React, { useContext, useState } from "react";
import Register from "./Register";
import Login from "./login";
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
  const { isValid, login, logout } = useContext(AuthContext);

  return (
    <>
      {!isValid.status ? (
        <Button onClick={toggleLoginModal} variant="text">
          Login
        </Button>
      ) : (
        <MiniProfile />
      )}

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

          {activeTab === 0 && <Login onSuccess={() => setLoginModal(false)} />}

          {activeTab === 1 && <Register role="merchant" />}
        </Box>
      </Modal>
    </>
  );
};

export default Auth;
