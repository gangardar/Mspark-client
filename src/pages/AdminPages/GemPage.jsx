import GemTable from "../../component/Gem/GemTable"
import useGem from "../../react-query/services/hooks/gems/useGem"

const GemPage = () => {
  const {data} = useGem(1,10);
  return (
    <GemTable data={data}/>
  )
}

export default GemPage