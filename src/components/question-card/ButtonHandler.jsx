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
      <div className="flex items-center gap-[1.56rem]">
        <Button variant="addOption">Add Option</Button>
        <Button variant="submit">Submit</Button>
      </div>
    ) : (
      <>
        <div className="flex items-center gap-[1.56rem]">
          {unAnswered && <Button variant="submit">Start</Button>}
          {!unAnswered && changeAble && (
            <Button variant="change">Change</Button>
          )}
          {!unAnswered && !changeAble && (
            <Button variant="result">Result</Button>
          )}
          {!result && <Button variant="result-outline">Result</Button>}
        </div>
        <br />
        {start && change && (
          <div className="flex items-center gap-[1.56rem]">
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

  return <div className="flex w-full justify-end pr-7">{renderButtons()}</div>;
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
