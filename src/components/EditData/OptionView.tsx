// components/OptionView.tsx
import React from 'react';

// Define the structure of an option
interface Option {
  label: string;
  about: string;
  value: string;
  data?: Array<{ label: string; value: string; url?: string }>;
}

const OptionView: React.FC<{ option: Option; index: number; onEdit: () => void; onDelete: () => void; }> = ({ option, onEdit, onDelete }) => (
  <>
    <h3 className="text-xl font-semibold mb-2">{option.label}</h3>
    <p className="mb-2">{option.about}</p>
    <p className="mb-4">{option.value}</p>
    <div className="space-y-2">
      {option.data &&
        option.data.map((data, i) => (
          <div key={i} className="mb-2">
            <h4 className="text-lg font-semibold mb-1">{data.label}</h4>
            <p>{data.value}</p>
            {data.url && (
              <a href={data.url} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">
                View Project
              </a>
            )}
          </div>
        ))}
    </div>
    <div className="flex justify-end space-x-2">
      <button onClick={onEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Edit
      </button>
      <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
        Delete
      </button>
    </div>
  </>
);

export default OptionView;
