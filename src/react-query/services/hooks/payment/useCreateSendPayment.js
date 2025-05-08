import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient"

const useCreateSendPayment = () => {
    const createPayment = async({auctionId, bidderPaymentId}) => {
        const response =  await axiosInstance.post('/payments/sendPayment', {auctionId, bidderPaymentId})
        return response.data;
    };

    return useMutation({
        mutationFn: createPayment
    })
}

export default useCreateSendPayment;