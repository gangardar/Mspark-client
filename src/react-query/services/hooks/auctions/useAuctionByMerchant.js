import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/auctions/merchant');

const useAuctionByMerchant = ({id}) => {
  return useQuery({
    queryKey: ['auctions', "merchant",id], // Unique key for the query
    queryFn: () => auctionApiClient.getById(id), 
  });
};

export default useAuctionByMerchant;