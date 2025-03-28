import { jwtDecode } from "jwt-decode";
import useGemByMerchantId from "../../react-query/services/hooks/gems/useGemByMerchantId";
import useGem from "../../react-query/services/hooks/gems/useGem";
import GemTable from "../../component/Gem/GemTable";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const GemPage = () => {
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

  // Fetch data conditionally based on the user's role
  const {
    data: adminData,
    isLoading: isAdminLoading,
    isError: isAdminError,
    error: adminError,
  } = useGem(1, 10, {
    enabled: isAdmin, // Only fetch if the user is an admin
  });

  const {
    data: merchantData,
    isLoading: isMerchantLoading,
    isError: isMerchantError,
    error: merchantError,
  } = useGemByMerchantId(merchantId, 1, 10, {
    enabled: !isAdmin && !!merchantId, // Only fetch if the user is not an admin and merchantId is available
  });

  // Determine which data to use based on the user's role
  const data = isAdmin ? adminData : merchantData;
  const isLoading = isAdmin ? isAdminLoading : isMerchantLoading;
  const isError = isAdmin ? isAdminError : isMerchantError;
  const error = isAdmin ? adminError : merchantError;

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

export default GemPage;