import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';

const CustomCombobox = ({ items, initialSelected, placeholder, selected, setSelected }) => {
  const [query, setQuery] = useState('');

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-[8.62px] border border-[#DEE6F7] bg-white text-left sm:text-sm tablet:rounded-[10px] tablet:border-[3px]">
          <Combobox.Input
            className="w-full bg-transparent py-2 pl-3 pr-4 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] tablet:py-3 tablet:pl-7 tablet:pr-10 tablet:text-[18px] tablet:leading-[21.78px]"
            displayValue={(item) => item.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <img
              src="/assets/svgs/downArrow.svg"
              alt="down-arrow"
              className={`h-[6.3px] w-[10.3px] tablet:h-[10px] tablet:w-[16px] `}
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-[10px] bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredItems.length === 0 && query !== '' ? (
              <div className="text-gray-700 relative cursor-default select-none px-4 py-2">Nothing found.</div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#6BA5CF] text-white' : 'text-[#B6B4B4]'
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-[#B6B4B4]'
                          }`}
                        ></span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default CustomCombobox;
