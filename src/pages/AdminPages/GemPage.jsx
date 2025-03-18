import { jwtDecode } from "jwt-decode"; 
import useGemByMerchantId from "../../react-query/services/hooks/gems/useGemByMerchantId";
import useGem from "../../react-query/services/hooks/gems/useGem";
import GemTable from "../../component/Gem/GemTable";

const GemPage = () => {
  // Decode the token to get user information
  const decodedToken = jwtDecode(localStorage.getItem("token"));
  const isAdmin = decodedToken.role === "admin";

  // Fetch data conditionally based on the user's role
  const {
    data: adminData,
    isLoading: isAdminLoading,
    isError: isAdminError,
    error: adminError,
  } = useGem(1, 10); // Fetch all gems for admin users

  const {
    data: merchantData,
    isLoading: isMerchantLoading,
    isError: isMerchantError,
    error: merchantError,
  } = useGemByMerchantId(decodedToken._id, 1, 10); // Fetch gems for non-admin users

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