import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

const useSoftDelete = () => {
    const deleteUser = async(id) => {
        return await axiosInstance.delete(`/users/${id}/softDelete`)
    }

    return useMutation({
        mutationFn: deleteUser
    })
}

export default useSoftDelete;