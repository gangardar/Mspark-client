import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const gemApiClient = new ApiClient('/gems/merchant');

const useGemByMerchantId = (merchantId, page, limit) => {
  return useQuery({
    queryKey: ['gems', merchantId, page, limit], // Unique key for the query
    queryFn: () => gemApiClient.getById(merchantId), // Correct API call
    onError: (error) => {
      console.error("Error fetching gems:", error); // Log errors for debugging
    },
  });
};

export default useGemByMerchantId;