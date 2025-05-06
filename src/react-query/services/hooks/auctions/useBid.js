import { QueryClient, useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/auctions')
const queryClient = new QueryClient();

const useBid = () => {
  const bidAuction = async({id, auction}) => {
    const res = await auctionApiClient.bid(id, auction)
    return res;
  }
  return useMutation({
    mutationFn: bidAuction,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['auction', variables.id]);
      queryClient.invalidateQueries(['auctions']); 
    },
  });
};

export default useBid;