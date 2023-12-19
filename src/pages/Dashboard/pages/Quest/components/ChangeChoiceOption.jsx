import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { changeOptions } from "../../../../../utils/options";
import CustomSwitch from "../../../../../components/CustomSwitch";

const ChangeChoiceOption = ({
  changeState,
  setChangeState,
  setChangedOption,
}) => {
  return (
    <div className="mx-5 flex flex-col items-center rounded-[0.30925rem] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] dark:bg-[#080A0C] tablet:rounded-[16px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[51px] laptop:px-7 laptop:py-[34px]">
      <div className="flex w-full items-center justify-between">
        <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[28px]">
          The participant can change their choice at a later time
        </h5>
        <CustomSwitch
          enabled={changeState}
          setEnabled={() => {
            setChangeState((prev) => !prev);
            setChangedOption("Daily");
          }}
        />
      </div>
      {changeState ? (
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue=""
            name="radio-buttons-group"
          >
            <div className="mb-[0px] mt-2 flex flex-wrap justify-center gap-[1px] tablet:-mb-4 tablet:gap-4">
              {changeOptions?.map((item) => (
                <FormControlLabel
                  key={item.id}
                  value={item.value}
                  control={<Radio sx={{ color: "#9C9C9C" }} />}
                  label={item.title}
                  className="h-[20px] w-[60px] text-[11px] md:text-sm tablet:h-[auto] tablet:w-[auto] "
                  onChange={(e) => {
                    setChangedOption(e.target.value);
                  }}
                />
              ))}
            </div>
          </RadioGroup>
        </FormControl>
      ) : null}
    </div>
  );
};

export default ChangeChoiceOption;