import { useContext, useEffect, useState } from "react";
import useGetBidByBidderId from "../../react-query/services/hooks/auctions/useGetBidByBidderId";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import BidTable from "../../component/Bid/BidTable";
import EnhancedTableSkeleton from "../../component/EnhancedTableSkeleton";
import SnackbarContext from "../../context/SnackbarContext";

export const BidHistoryPage = () => {
  const { isValid } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [userId, setUserId] = useState(null);
  
  // Extract user ID when isValid changes
  useEffect(() => {
    if (isValid?.status && isValid?.token) {
      const { _id } = jwtDecode(isValid.token);
      setUserId(_id);
    }
  }, [isValid]);

  const {
    data: bidHistory,
    isLoading: isLoadingBids,
    isError: isErrorBids,
    error: bidError,
    isSuccess,
  } = useGetBidByBidderId(userId,{enabled : !!userId}); // Now using userId state

  if (!isValid?.status) {
    return <div>Please log in to view your bid history</div>;
  }

  if (isLoadingBids) {
    return <EnhancedTableSkeleton />;
  }

  if (isErrorBids) {
    showSnackbar(bidError.message);
    return <div>Error loading bid history</div>;
  }

  if(isSuccess)
    return <BidTable bidHistory={bidHistory} />;
};