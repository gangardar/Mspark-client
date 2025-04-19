import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../../apiClient"

const useSyncLedger = () => {
    const syncAccount = async() => {
        axiosInstance.post('/mspark/sync-ledger')
    }

    return useMutation({
        mutationFn: syncAccount
    })
}

export default useSyncLedger;