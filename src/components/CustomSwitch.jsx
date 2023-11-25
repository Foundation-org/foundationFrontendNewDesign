import { Switch } from "@headlessui/react";

const CustomSwitch = ({ enabled, setEnabled }) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? "bg-[#7EEAAF]" : "bg-[#D9D9D9]"}
    green-select`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled
            ? "translate-x-6 bg-[#0DA65D]"
            : "-translate-x-[7px] bg-[#707070]"
        }
      green-select-shape`}
      />
    </Switch>
  );
};

export default CustomSwitch;
