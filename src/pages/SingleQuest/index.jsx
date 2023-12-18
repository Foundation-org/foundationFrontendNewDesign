import { useParams } from "react-router-dom";

const SingleQuest = () => {
  let { id } = useParams();

  return <div>SingleQuest {id}</div>;
};

export default SingleQuest;
