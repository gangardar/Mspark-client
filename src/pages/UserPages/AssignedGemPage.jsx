import { jwtDecode } from "jwt-decode";
import GemTable from "../../component/Gem/GemTable";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import useGemByVerifierId from "../../react-query/services/hooks/gems/useGemByVerifierId";

const AssignedGemPage = () => {
  const { isValid } = useContext(AuthContext);
  console.log(isValid);

  let decodedToken = null;
  let isAdmin = false;
  let merchantId = null;

  // Only decode the token if it exists and is valid
  if (isValid.status && isValid.token) {
    try {
      decodedToken = jwtDecode(isValid.token);
      console.log("Decoded token:", decodedToken);
      isAdmin = decodedToken.role === "admin";
      merchantId = decodedToken._id; // Get the merchant ID from the token
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const {
    data ,
    isLoading ,
    isError ,
    error,
  } = useGemByVerifierId(merchantId, 1, 10, {
    enabled: !isAdmin && !!merchantId, // Only fetch if the user is not an admin and merchantId is available
  });

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Gem Page</h3>
      <GemTable data={data} />
    </div>
  );
};

export default AssignedGemPage;