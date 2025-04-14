import { useQuery } from "@tanstack/react-query";
import  { axiosInstance } from "../../apiClient";

const useGetBidByBidderId = ({id,page,limit,status}) => {
  const fetchBid = async() => {
    const response = await axiosInstance.get(`/bids/${id}`,{params : {
      page,
      limit,
      status
    }})
    return response.data
  }
  return useQuery({
    queryKey: ['auctions-bid', id, page, limit, status], // Unique key for the query
    queryFn: () => fetchBid()
  });
};

export default useGetBidByBidderId;