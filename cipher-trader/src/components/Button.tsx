import React from 'react';

interface Props {
  label: string;
  disabled?: boolean;
  type: 'buy' | 'sell';
  onClick: () => void;
}

export function Button({label, disabled, type, onClick}: Props) {
  return (
    <div className="inline-block mr-2 mt-2">
      <button
        type="button"
        disabled={disabled}
        className={`focus:outline-none text-white text-sm py-2 px-4 border-b-2 border-${type}-1 rounded-md bg-gray-900 hover:bg-gray-800 disabled:opacity-50`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
}
