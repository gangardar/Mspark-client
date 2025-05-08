import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../../apiClient"

const useAdminSummary = () => {
    return useQuery({
        queryKey : ["admin-summary"],
        queryFn: async() => {
            const response = await axiosInstance.get('/admin/dashboard/summary')
            return response.data;
        }
    })
}

export default useAdminSummary