import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/auctions');

const useAddAuction = () => {
    const createAuction = async ({ auction }) => {
        const res = await auctionApiClient.add(auction);
        return res;
    };

    return useMutation({
        mutationFn: createAuction
    });
};

export default useAddAuction;