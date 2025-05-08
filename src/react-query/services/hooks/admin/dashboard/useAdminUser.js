import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../../apiClient"

const useAdminUser = () => {
    return useQuery({
        queryKey : ["admin-users"],
        queryFn: async() => {
            const response = await axiosInstance.get('/admin/dashboard/users')
            return response.data;
        }
    })
}

export default useAdminUser