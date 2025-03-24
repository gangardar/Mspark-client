
import VerifyGem from "../../component/Gem/VerifyGem";
import { useParams } from "react-router-dom";

const VerificationPage = () => {
  const { id } = useParams();
  return (
    <div>
      <VerifyGem id={id}/>
    </div>
  );
};

export default VerificationPage;