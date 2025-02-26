import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../apiClient";

const userApiClient = new ApiClient('/users/role');

const useUserByRole = (page, limit, role) => {
  return useQuery({
    queryKey: ['gems', page, limit, role], // Unique key for the query
    queryFn: () => userApiClient.getByRole({ queryKey: [{ page, limit, role }] }), // Pass an array of objects
  });
};

export default useUserByRole;