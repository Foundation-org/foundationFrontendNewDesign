const Navbar = ({ handleTab, tab }) => {
  return (
    <div className="flex justify-center gap-[15.44px] tablet:gap-[32px] xl:gap-[50px]">
      <button
        className={`${
          tab === 0 ? "bg-[#459EDE] text-white" : "bg-[#E6E6E6] text-[#ACACAC]"
        } quest-topbar`}
        onClick={() => {
          handleTab(0);
        }}
      >
        Rank Choice
      </button>
      <button
        className={`${
          tab === 1 ? "bg-[#459EDE] text-white" : "bg-[#E6E6E6] text-[#ACACAC]"
        } quest-topbar`}
        onClick={() => {
          handleTab(1);
        }}
      >
        Multiple choice
      </button>
      <button
        className={`${
          tab === 2 ? "bg-[#459EDE] text-white" : "bg-[#E6E6E6] text-[#ACACAC]"
        } quest-topbar`}
        onClick={() => {
          handleTab(2);
        }}
      >
        Agree/Disagree
      </button>
      <button
        className={`${
          tab === 3 ? "bg-[#459EDE] text-white" : "bg-[#E6E6E6] text-[#ACACAC]"
        } quest-topbar`}
        onClick={() => {
          handleTab(3);
        }}
      >
        Yes/No
      </button>
    </div>
  );
};

export default Navbar;
