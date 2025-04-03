import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/auctions')

const useBid = () => {
  const bidAuction = async({id, auction}) => {
    console.log(id, auction)
    const res = await auctionApiClient.bid(id, auction)
    return res.data;
  }
  return useMutation({
    mutationFn : bidAuction
  });
};

export default useBid;