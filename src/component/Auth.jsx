import {
  Box, Modal, Tab,
  Tabs
} from "@mui/material";
import { useEffect, useState } from "react";
import Register from "./Register";
import Login from "./login";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: { xs: '80vw', sm: 400 },
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  maxHeight: {xs:"80vh", md: "90vh"},
  boxShadow: 24,
  overflow: "auto",
  p: {xs:2, md:3},
  borderRadius: 2,
};

const Auth = ({loginModal, setLoginModal}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const role = searchParams.get('role') || undefined;


  // Handle URL role changes
  useEffect(() => {
    if (role) {
      setLoginModal(true);
      setActiveTab(1);
    }
  }, [role, setLoginModal]);

  // Close modal and clear role param
  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('role');
    setSearchParams(params);
    setLoginModal(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = loginModal ? 'hidden' : '';
  }, [loginModal]);

  return (
    <>
      <Modal
        open={loginModal}
        onClose={handleCloseModal}
        aria-labelledby="login-modal"
      >
        <Box sx={style}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          {activeTab === 0 && <Login onSuccess={handleCloseModal} />}
          {activeTab === 1 && <Register role={role} setLoginTab={setActiveTab} />}
        </Box>
      </Modal>
    </>
  );
};

Auth.propTypes = {
  loginModal : PropTypes.bool.isRequired,
  setLoginModal: PropTypes.func.isRequired
}


export default Auth;
