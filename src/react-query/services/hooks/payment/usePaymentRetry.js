import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";
const paymentApi = new ApiClient("/payments/handleExpiredPayment");

export const usePaymentRetry = () => {
  const retryPayment = async ({ auctionId }) => {
    const res = await paymentApi.add({ auctionId });
    return res;
  };

  return useMutation({
    mutationFn: retryPayment,
  });
};
