import { toast } from "sonner";
import { useSelector } from "react-redux";

const DeleteOption = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleDeleteOption = () => {
    const newArr = props.answersSelection.filter(
      (item) => item.label !== props.answer,
    );

    props.setAnswerSelection(newArr);

    toast.success("Item deleted");
    props.setAddOptionLimit(0);
    props.handleEditClose();
  };

  return (
    <div className="flex min-w-[350px] flex-col items-center gap-4 rounded-[26px] bg-[#232628] p-6">
      <h1 className="text-[22px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF]">
        Delete Option
      </h1>
      <div className="flex gap-6">
        <button
          className="inset-0 w-full rounded-[10px] bg-[#d11a2a] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner"
          onClick={handleDeleteOption}
        >
          Yes
        </button>
        <button
          className={` ${
            persistedTheme === "dark"
              ? "bg-[#333B46]"
              : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
          } inset-0 w-full rounded-[10px] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner`}
          onClick={() => {
            props.handleDeleteClose();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteOption;
