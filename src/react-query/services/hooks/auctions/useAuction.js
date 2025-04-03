import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/auctions');

const useAuction = ({page =1 , limit=10}) => {
  return useQuery({
    queryKey: ['auctions', {page, limit}], // Unique key for the query
    queryFn: () => auctionApiClient.getActiveData({ queryKey: [{ page, limit }] }), // Pass an array of objects
  });
};

export default useAuction;