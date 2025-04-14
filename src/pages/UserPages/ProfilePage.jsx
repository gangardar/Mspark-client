
import useGetMe from "../../react-query/services/hooks/users/useGetMe";
import Profile from "../../component/User/Profile";


export const ProfilePage = () => {
    console.log("Profile Page")
    const {data : userData, isLoading,error} = useGetMe()
    if(isLoading) return ("Loading User!")
    if(error) console.log(error)
  return (
    <Profile user={userData.data}/>
  )
}
