import { useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../../../context/AuthContext";
import { usePayments } from "../../../react-query/services/hooks/payment/usePayments";
import { LoadingSpinner } from "../../../component/common/LoadingSpinner";
import { ErrorMessage } from "../../../component/common/ErrorMessage";
import { AllPaymentComponent } from "../../../component/Payment/AllPaymentComponent";
import PropTypes from "prop-types";

export const AllPaymentsPage = ({status}) => {
  const { isValid } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(status || "all");

  useEffect(() => {
    setStatusFilter(status)
  }, [status])
  
  // Decode user data
  const userData = useMemo(() => {
    if (!isValid?.token) return null;
    try {
      return jwtDecode(isValid.token);
    } catch (error) {
      console.error("JWT decoding failed:", error);
      return null;
    }
  }, [isValid?.token]);

  // Fetch payments
  const {
    data,
    error,
    isError,
    isLoading,
    isFetched
  } = usePayments(
    { 
      userData,
      page,
      status: statusFilter === "all" ? undefined : statusFilter
    },
    { 
      enabled: !!userData,
      keepPreviousData: true
    }
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when filter changes
  };

  // Loading state
  if (isLoading && !data) return <LoadingSpinner message="Loading payment data..." />;

  // Error state
  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load payments"
        }
      />
    );
  }

  // Success state
  return (
    <>
    <AllPaymentComponent
      paymentsData={data}
      isLoading={isLoading}
      isError={isError}
      isFetched={isFetched}
      error={error}
      onPageChange={handlePageChange}
      onStatusFilterChange={handleStatusFilterChange}
    />
    </>
  );
};

AllPaymentsPage.propTypes = {
    status: PropTypes.oneOf([
        'new',
        'pending',
        'confirming',
        'paid',
        'failed',
        'refunded',
        'partially_refunded'
      ]),
}