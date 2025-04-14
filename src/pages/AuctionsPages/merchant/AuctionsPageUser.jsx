import AuctionTable from "../../../component/Auction/AuctionTable"
import PropTypes from "prop-types";

const AuctionsPageUser = ({auctionStatus}) => {
  return (
    <>
        <AuctionTable auctionStatus={auctionStatus}/>
    </>
  )
}

AuctionsPageUser.propTypes = {
  auctionStatus: PropTypes.string
}

export default AuctionsPageUser