import { useQuery } from '@tanstack/react-query';
import ApiClient from '../../apiClient';

const auctionApiClient = new ApiClient('/auctions')

const useAuction = ({ 
  page = 1, 
  limit = 10,
  status = 'active',
  gemType = '',
  minPrice = null,
  maxPrice = null,
  sortBy = 'endingSoon',
  search = ''
}) => {
  return useQuery({
    queryKey: ['auctions', { 
      page, 
      limit, 
      status,
      gemType,
      minPrice,
      maxPrice,
      sortBy,
      search 
    }],
    queryFn: () => auctionApiClient.getByFilters({
      page,
      limit,
      status,
      gemType,
      minPrice,
      maxPrice,
      sortBy,
      search
    }),
    keepPreviousData: true, // Smooth pagination transitions
  });
};

export default useAuction;