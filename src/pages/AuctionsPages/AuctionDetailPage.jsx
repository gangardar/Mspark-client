import { useParams } from "react-router-dom"
import AuctionDetail from "../../component/Auction/AuctionDetail"

const AuctionDetailPage = () => {
  const {id} = useParams() 
  return (
    <>
      <AuctionDetail auctionId={id}/>
    </>
  )
}

export default AuctionDetailPage