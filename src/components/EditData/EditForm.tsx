// components/EditForm.tsx
import React, { FormEvent, useState } from 'react';
import DataEditor from './DataEditor';
import FormField from './FormField';
import FormTextArea from './FormTextArea';

// Define the structure of an option
interface Option {
  label: string;
  about: string;
  value: string;
  data?: Array<{ label: string; value: string; url?: string }>;
}

// Define the props for the EditForm component
const EditForm: React.FC<{
  option: Option;
  index?: number;
  isNew?: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>, data: Array<{ label: string; value: string; url?: string }>, index?: number, isNew?: boolean) => Promise<void>;
  onCancel: () => void;
}> = ({ option, index, isNew, onSubmit, onCancel }) => {
  const [localData, setLocalData] = useState(option.data || []);

  return (
    <form onSubmit={(e) => onSubmit(e, localData, index, isNew)}>
      <FormField label="Label" id="label" defaultValue={option.label} required />
      <FormField label="About" id="about" defaultValue={option.about} required />
      <FormTextArea label="Value" id="value" defaultValue={option.value} required />

      <DataEditor data={localData} onChange={setLocalData} />

      <div className="flex justify-between space-x-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditForm;
