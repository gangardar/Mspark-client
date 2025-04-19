import { useEffect, useState } from "react";
import UserTableTwo from "../../component/User/UserTableTwo";
import { useUser } from "../../react-query/services/hooks/users/useUser";
import PropTypes from "prop-types";


const AllUsersPage = ({role = 'all'}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState(role);

  useEffect(() => {
    setRoleFilter(role)
  },[role])

  const { data, isLoading, isError, error } = useUser({
    page,
    limit,
    role: roleFilter === 'all' ? undefined : roleFilter
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <UserTableTwo
        users={data?.data || []}
        pagination={data?.meta?.pagination || { page, limit, total: 0 }}
        onPageChange={setPage}
        onLimitChange={setLimit}
        role ={roleFilter}
        onRoleFilterChange={setRoleFilter}
        isLoading={isLoading}
      />
    </div>
  );
};

AllUsersPage.propTypes = {
    role : PropTypes.string
}

export default AllUsersPage;