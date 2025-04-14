import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useVerifiedGemByMerchant = ({ merchantId }) => {
  return useQuery({
    queryKey: ['gems', 'merchant', merchantId, 'verified'],
    queryFn: async () => {
      const res = await axiosInstance.get(`/gems/merchant/${merchantId}`, {
        params: {
          status: "verified"
        }
      });
      return res.data; // Access the data property directly
    }
  });
};

export default useVerifiedGemByMerchant;