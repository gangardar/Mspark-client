import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useGemByMerchantId = ({merchantId, page =1 , limit=10, status}) => {
  const fetchGem = async() => {
    const response = await axiosInstance.get(`/gems/merchant/${merchantId}`,{
      params : {
        page, limit, status
      }
    })
    return response.data
  }
  return useQuery({
    queryKey: ['gems', merchantId, page, limit, status], // Unique key for the query
    queryFn: () => fetchGem() // Correct API call
  });
};

export default useGemByMerchantId;