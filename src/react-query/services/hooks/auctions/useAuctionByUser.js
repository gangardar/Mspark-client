import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apiClient";

const useAuctionByUser = ({ userData, page = 1, limit = 10, status }) => {
  const url =
    userData?.role === "merchant" ? "auctions/merchant" : "auctions/bidder";
  const fetchAuction = async () => {
    const response = await axiosInstance.get(`${url}/${userData?._id}`, {
      params: {
        page,
        limit,
        status,
      },
    });
    return response.data;
  };
  return useQuery({
    queryKey: ["auctions", "bidder", userData?._id, page, limit, status], // Unique key for the query
    queryFn: () => fetchAuction(),
  });
};

export default useAuctionByUser;
