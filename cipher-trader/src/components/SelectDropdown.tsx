import React from 'react';

interface Props {
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export function SelectDropdown({options, selectedOption, onChange}: Props) {
  const selectOption = React.useCallback((event) => onChange(event.target.id), [onChange]);

  return (
    <div className="group inline-block relative">
      <button className="bg-graay-900 text-white font-semibold text-xl py-1 pr-6 rounded inline-flex items-center focus:outline-none">
        <span className="mr-1 text-shadow">{selectedOption || 'Select a ticker'}</span>
        <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="2 3 15 15">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>
      <ul className={`hidden absolute group-focus:hidden group-hover:block text-gray-700 pt-1 text-lg`}>
        {options
          .filter((value) => value !== selectedOption)
          .map((value) => {
            return (
              <li key={value} className="cursor-pointer">
                <span
                  id={value}
                  onClick={selectOption}
                  className="bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 block whitespace-no-wrap"
                >
                  {value}
                </span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
