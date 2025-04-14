import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const auctionApiClient = new ApiClient('/wallet');

const useCreateWallet = () => {
    const createWallet = async ({ wallet }) => {
        const res = await auctionApiClient.add(wallet);
        return res;
    };

    return useMutation({
        mutationFn: createWallet
    });
};

export default useCreateWallet;