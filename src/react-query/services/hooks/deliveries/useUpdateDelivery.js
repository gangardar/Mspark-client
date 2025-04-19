import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

export const useUpdateDeliveryStatus = () => {
    const updateStatus = async({id, status}) => {
        axiosInstance.put(`/deliveries/${id}/status`, {status})
    }

    return useMutation({
        mutationFn : updateStatus
    })
}