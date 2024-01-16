import { Button } from "../ui/Button";

const ButtonHandler = ({
  expandedView,
  unAnswered,
  changeAble,
  start,
  change,
  result,
}) => {
  const renderButtons = () => {
    const commonButtons = expandedView ? (
      <div>
        <Button variant="addOption">Add Option</Button>
        <Button variant="submit">Submit</Button>
      </div>
    ) : (
      <>
        <div>
          {unAnswered && <Button variant="submit">Start</Button>}
          {!unAnswered && changeAble && (
            <Button variant="change">Change</Button>
          )}
          {!changeAble && <Button variant="result">Result</Button>}
          {result && <Button variant="result-outline">Result</Button>}
        </div>
        <br />
        {start && change && (
          <div>
            <Button variant="addOption">Add Option</Button>
            <Button variant="cancel">Cancel</Button>
            <Button variant="submit">Submit</Button>
          </div>
        )}
      </>
    );

    return (
      <>
        {commonButtons}
        {!expandedView && result && (
          <div>
            <Button variant="cancel">Cancel</Button>
          </div>
        )}
      </>
    );
  };

  return <div>{renderButtons()}</div>;
};

export default ButtonHandler;

{
  /* <Button variant="addOption">Add Option</Button>
      <Button variant="cancel">Cancel</Button>
      <Button variant="submit">Submit</Button>
      <Button variant="change">Change</Button>
      <Button variant="result">Result</Button>
      <Button variant="result-outline">Result</Button>
      <Button variant="submit">Start</Button> */
}
