import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

const usePendingPayment = () => {
    return useQuery({
        queryKey : ["pending-send-payments"],
        queryFn : async() => {
            const response = await axiosInstance.get('/payments/tobeSend')
            return response.data;
        }
    })
}

export default usePendingPayment;