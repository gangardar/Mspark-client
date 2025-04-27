import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

const useRestoreUser = () => {
    const deleteUser = async(id) => {
        return await axiosInstance.put(`/users/${id}/restore`)
    }

    return useMutation({
        mutationFn: deleteUser
    })
}

export default useRestoreUser;