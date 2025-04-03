import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/bids');

const useGetBidByBidderId = (id) => {
  return useQuery({
    queryKey: ['auctions-bid', id], // Unique key for the query
    queryFn: () => auctionApiClient.getById(id)
  });
};

export default useGetBidByBidderId;