import {
    Button
} from "@mui/material";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import PropTypes from "prop-types";
import ProfileCard from "../MiniProfile";


const AuthButton = ({setLoginModal}) => {
  const { isValid} = useContext(AuthContext);

  return (
    <>
      {!isValid.status ? (
        <Button onClick={() => setLoginModal(true)} variant="text">
          Login
        </Button>
      ) : (
        <ProfileCard />
      )}
    </>
  );
};

AuthButton.propTypes = {
    setLoginModal : PropTypes.func.isRequired
}


export default AuthButton;
