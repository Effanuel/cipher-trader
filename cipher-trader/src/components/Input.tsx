import React from 'react';

interface Props<T> {
  id: T;
  label: string;
  value: any;
  onChange: (value: string, id: string) => void;
}

export function Input<T extends string>({id, label, value, onChange}: Props<T>) {
  const invokeValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value, id);
    },
    [onChange, id],
  );

  return (
    <div className="flex flex-col">
      <label htmlFor="price" className="mt-4 mb-1 uppercase text-white text-xs font-semibold">
        {label}
      </label>
      <div className="flex flex-row">
        <input
          id={id}
          type="number"
          name="price"
          className="focus:outline-none bg-gray-800 text-white py-2 px-1 border-b-2 border-gray-900 font-bold rounded-md text-grey-darkest"
          value={value}
          onChange={invokeValueChange}
        />
      </div>
    </div>
  );
}
