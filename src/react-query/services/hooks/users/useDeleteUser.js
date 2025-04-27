import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

const useDeleteUser = () => {
    const deleteUser = async(id) => {
        return await axiosInstance.delete(`/users/${id}`)
    }

    return useMutation({
        mutationKey: ['users'],
        mutationFn: deleteUser
    })
}

export default useDeleteUser;