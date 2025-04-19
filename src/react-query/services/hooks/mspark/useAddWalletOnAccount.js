import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useAddWalletOnAccount = () => {
  const addWallet = async ({ id, walletAddress }) => {
    return await axiosInstance.put(`/mspark/account/${id}`, { walletAddress });
  };
  return useMutation({
    mutationFn: addWallet,
  });
};

export default useAddWalletOnAccount;
