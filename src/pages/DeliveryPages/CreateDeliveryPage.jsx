import { useContext } from "react"
import DeliveryForm from "../../component/Delivery/DeliveryForm"
import { useCreateDelivery } from "../../react-query/services/hooks/deliveries/useCreateDelivery"
import useGem from "../../react-query/services/hooks/gems/useGem"
import { useUser } from "../../react-query/services/hooks/users/useUser"
import SnackbarContext from "../../context/SnackbarContext"

const CreateDeliveryPage = () => {
    const {mutateAsync : createDelivery} = useCreateDelivery()
    const {data: gems, isLoading : loadingGem} = useGem()
    const {showSnackbar} = useContext(SnackbarContext)
    const handleSubmit = (data) => {
        console.log(data)
        try{
            const res = createDelivery({...data})
            showSnackbar(res?.data?.data.message || "Successfully created!")
        }catch(err){
            showSnackbar(err?.response?.data?.data?.message || err?.message || "Error Creating new Delivery", "error")
        }
    };
    const {data: users, isLoading: loadingUser}  = useUser(1,100)
    const isLoading = loadingGem || loadingUser
    
  return (
    <>
        <DeliveryForm onSubmit={handleSubmit} availableGems={gems?.data} availableUsers={users?.data} loading={isLoading}/>
    </>
  )
}

export default CreateDeliveryPage