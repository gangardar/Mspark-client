import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";
import useAuth from "../../../../context/useAuth";


const useAddAddress = () => {
    const {userData} = useAuth();
    let route = '/users/address';
    if(userData.role === "admin"){
        route = '/mspark/mspark'
    }
    const userAddressApiClient = new ApiClient(route);
    const createAddress = async ({ address }) => {
        const res = await userAddressApiClient.add(address);
        return res;
    };

    return useMutation({
        mutationFn: createAddress
    });
};

export default useAddAddress;