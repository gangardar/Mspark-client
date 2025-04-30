import { useContext, useMemo } from "react";
import AuthContext from "../../context/AuthContext";
import useSoldGemByMerchantId from "../../react-query/services/hooks/gems/useSoldGemByMerchantId";
import { jwtDecode } from "jwt-decode";
import { LoadingSpinner } from "../../component/common/LoadingSpinner";
import { ErrorMessage } from "../../component/common/ErrorMessage";
import GemTable from "../../component/Gem/GemTable";

function SoldGemForMerchantPage() {
  const { isValid } = useContext(AuthContext);
  const userData = useMemo(() => {
    if (!isValid?.token) return null;
    try {
      return jwtDecode(isValid.token);
    } catch (error) {
      console.error("JWT decoding failed:", error);
      return null;
    }
  }, [isValid?.token]);

  const {
    data: soldGems,
    isLoading,
    isError,
    error,
    refetch
  } = useSoldGemByMerchantId(
    { merchantId: userData?._id },
    { enabled: !!userData?._id }
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading sold gems..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load sold gems"
        }
      />
    );
  }

  if (!soldGems?.data?.length) {
    console.log(soldGems)
    return <ErrorMessage message="No sold gems found" />;
  }

  return <GemTable data={soldGems} refetch={refetch}/>;
}

export default SoldGemForMerchantPage;
