import { Container } from "@mui/material";
import useAuction from "../../react-query/services/hooks/auctions/useAuction";
import Auctions from "../../component/Auction/Auctions";
import AuctionSkeleton from "../../component/Auction/AuctionSkeleton";

const ViewAllAuctions = () => {
  
  return (
    <>
      <Container>
        <Auctions/>
      </Container>
    </>
  );
};

export default ViewAllAuctions;
