import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const userAddressApiClient = new ApiClient('/users/address');

const useAddAddress = () => {
    const createAddress = async ({ address }) => {
        const res = await userAddressApiClient.add(address);
        return res;
    };

    return useMutation({
        mutationFn: createAddress
    });
};

export default useAddAddress;