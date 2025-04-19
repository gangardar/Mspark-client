import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

const useUpdateMsparkAddress = () => {
    const updateAddress = async ({id,country, state, city, street, houseNo, postalcode}) => {
        return await axiosInstance.put(`/mspark/address/${id}`,{country, state,city,street,houseNo,postalcode})
    }
    return useMutation({
        mutationFn: updateAddress
    })
}

export default useUpdateMsparkAddress;