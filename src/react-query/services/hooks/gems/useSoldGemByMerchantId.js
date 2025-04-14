import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useSoldGemByMerchantId = ({merchantId}) => {
  const fetchGem = async() => {
    const res = await axiosInstance.get(`gems/merchant/${merchantId}/sold`)
    return res.data;
  }
  return useQuery({
    queryKey: ['gems', merchantId, 'sold'], // Unique key for the query
    queryFn: () => fetchGem(), // Correct API call
  });
};

export default useSoldGemByMerchantId;