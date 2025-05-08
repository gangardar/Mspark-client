import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../../apiClient"

const useAdminAuction = () => {
    return useQuery({
        queryKey : ["admin-auctions"],
        queryFn: async() => {
            const response = await axiosInstance.get('/admin/dashboard/auctions')
            return response.data;
        }
    })
}

export default useAdminAuction