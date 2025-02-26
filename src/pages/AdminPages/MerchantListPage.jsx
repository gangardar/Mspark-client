import UserTable from "../../component/User/UserTable"
import useUserByRole from "../../react-query/services/hooks/users/useMerchant"

const MerchantListPage = () => {
  const {data} = useUserByRole(1,10,"merchant")
  return (
    <>
      <UserTable data={data} />
    </>
  )
}

export default MerchantListPage