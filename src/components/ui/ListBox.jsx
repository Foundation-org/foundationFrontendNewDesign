import { Fragment, useState } from 'react';
import { Listbox as ListBoxL, Transition } from '@headlessui/react';

export default function Listbox({ items }) {
  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="w-full">
      <ListBoxL value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <ListBoxL.Button className="focus-visible:border-indigo-500 focus-visible:ring-offset-orange-300 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              {/* <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/downArrow.svg`}
                alt="down-arrow"
                className={`h-[6.3px] w-[10.3px] tablet:h-[10px] tablet:w-[16px] `}
              />
            </span>
          </ListBoxL.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListBoxL.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {items.map((item, index) => (
                <ListBoxL.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item}</span>
                      {selected ? (
                        <span className="text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3">
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                          <img
                            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/downArrow.svg`}
                            alt="down-arrow"
                            className={`h-[6.3px] w-[10.3px] tablet:h-[10px] tablet:w-[16px] `}
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListBoxL.Option>
              ))}
            </ListBoxL.Options>
          </Transition>
        </div>
      </ListBoxL>
    </div>
  );
}
