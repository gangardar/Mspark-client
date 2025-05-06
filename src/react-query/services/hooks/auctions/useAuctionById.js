import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/auctions');

const useAuctionById = ({id}) => {
  return useQuery({
    queryKey: ['auction', id], // Unique key for the query
    queryFn: () => auctionApiClient.getById(id), // Pass an array of objects
  });
};

export default useAuctionById;