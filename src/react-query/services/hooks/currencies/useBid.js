import { useMutation } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const currencyApi = new ApiClient('/coingate/currencies')

const useCurrencies = () => {
  const bidAuction = async() => {
    const res = await currencyApi.getActiveData()
    return res.data;
  }
  return useMutation({
    mutationFn : bidAuction
  });
};

export default useCurrencies;