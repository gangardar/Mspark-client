import { useContext, useEffect, useState } from "react";
import useGetBidByBidderId from "../../react-query/services/hooks/auctions/useGetBidByBidderId";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import BidTable from "../../component/Bid/BidTable";
import EnhancedTableSkeleton from "../../component/EnhancedTableSkeleton";
import SnackbarContext from "../../context/SnackbarContext";
import { Typography } from "@mui/material";

export const BidHistoryPage = () => {
  const { isValid } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

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
  } = useGetBidByBidderId(
    {
      id: userId,
      page,
      limit,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
    {
      enabled: !!userId,
    }
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when filter changes
  };

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

  if (isSuccess) {
    return (
      <>
        <Typography variant="h5" component="h2">
          Bid History
        </Typography>
        <BidTable
          bidHistory={bidHistory}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onStatusChange={handleStatusChange}
          currentPage={page}
          currentLimit={limit}
          currentStatus={statusFilter}
        />
      </>
    );
  }

  return null;
};
