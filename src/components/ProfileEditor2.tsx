'use client';
import { adaptUsername, getData, saveData } from '@/actions/api';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';

// Define the structure of an option
interface Option {
  label: string;
  about: string;
  value: string;
  data?: Array<{ label: string; value: string; url?: string }>;
  editing?: boolean; // Add the editing property
}

const ProfileEditor = ({ username }: { username?: string }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const router = useRouter();

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newOption, setNewOption] = useState<Option>({ label: '', about: '', value: '', editing: true });
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Toggle edit mode for an option
  const toggleEdit = (index: number) => {
    setOptions(prevOptions =>
      prevOptions.map((option, idx) =>
        idx === index ? { ...option, editing: !option.editing } : option
      )
    );
  };

  // Add a new option
  const handleAddOption = () => {
    setIsAddingNew(true);
  };

  // Delete an option
  const handleDeleteOption = async (index: number) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
    await saveData(updatedOptions, username);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  // Allow dragging over an element
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop of a dragged element
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, index: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const updatedOptions = [...options];
    const [draggedOption] = updatedOptions.splice(draggedIndex, 1);
    updatedOptions.splice(index, 0, draggedOption);
    setOptions(updatedOptions);
    await saveData(updatedOptions, username);
  };

  // Update an option
  const updateOption = async (
    e: FormEvent<HTMLFormElement>,
    updatedData: Array<{ label: string; value: string; url?: string }>,
    index?: number,
    isNew?: boolean
  ) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      label: { value: string };
      about: { value: string };
      value: { value: string };
    };

    setLoading(true); // Start loading

    const newOptions = [...options];
    const newOptionData = {
      label: target.label.value,
      about: target.about.value,
      value: target.value.value,
      data: updatedData,
      editing: false,
    };

    if (isNew) {
      setOptions([...options, newOptionData]);
      setIsAddingNew(false);
    } else if (index !== undefined) {
      newOptions[index] = newOptionData;
      setOptions(newOptions);
    }

    await saveData(newOptions, username);
    setLoading(false); // End loading
  };

  // Load options on mount
  useEffect(() => {
    (async () => {
      setLoading(true); // Start loading
      const data = username ? await getData(username) : await getData();
      setOptions(data.options);
      setLoading(false); // End loading
    })();
  }, [username]);

  // Change the username
  const changeUsername = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
    };

    if (username) {
      await adaptUsername(username, target.username.value);
    }
    router.push(`/edit/${target.username.value}`);
  };

  return (
    <div className="bg-gray-100 text-gray-700 y-2 p-8 m-auto w-screen min-h-screen">
      <div className="max-w-4xl mx-auto rounded-lg p-6 bg-white shadow-md mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
        <h3 className="text-xl font-semibold mb-2">Change Username</h3>
        <form onSubmit={changeUsername}>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
            New Username
          </label>
          <div className="flex align-center gap-4">
            <input
              type="text"
              id="username"
              className="block flex-grow px-3 py-2 w-full text-sm text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={username}
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 h-full">
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Editable options list */}
      <div className="space-y-6">
        {options.map((option, index) => (
          <div
            key={index}
            draggable={!option.editing}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`max-w-4xl mx-auto rounded-lg p-6 bg-white shadow-md mb-4 transition-all duration-300 ${!option.editing ? 'cursor-grab hover:bg-gray-50' : ''}`}
          >
            {option.editing ? (
              <EditForm
                option={option}
                index={index}
                onSubmit={updateOption}
                onCancel={() => toggleEdit(index)}
              />
            ) : (
              <OptionView option={option} index={index} onEdit={() => toggleEdit(index)} onDelete={() => handleDeleteOption(index)} />
            )}
          </div>
        ))}

        {/* Add New Option Section */}
        {!isAddingNew ? (
          <div className="w-full flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-6 hover:bg-blue-600 transition duration-300" onClick={handleAddOption}>
              +
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto rounded-lg p-6 bg-white shadow-md mb-4">
            <EditForm
              option={newOption}
              isNew={true}
              onSubmit={updateOption}
              onCancel={() => setIsAddingNew(false)}
            />
          </div>
        )}
      </div>

      {loading && <div className="text-center text-gray-500 mt-4">Loading...</div>} {/* Loading indicator */}
    </div>
  );
};

export default ProfileEditor;

// Editable Option View
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
    <div className="flex items-center justify-between space-x-4 mt-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  </>
);

// Editable Form for Options
const EditForm: React.FC<{
  option: Option;
  index?: number;
  isNew?: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>, updatedData: Array<{ label: string; value: string; url?: string }>, index?: number, isNew?: boolean) => void;
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

// Reusable Form Field Component
const FormField: React.FC<{ label: string; id: string; defaultValue: string; required?: boolean }> = ({ label, id, defaultValue, required }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={id}
      className="block px-3 py-2 w-full text-sm text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue={defaultValue}
      required={required}
    />
  </div>
);

// Reusable Form Text Area Component
const FormTextArea: React.FC<{ label: string; id: string; defaultValue: string; required?: boolean }> = ({ label, id, defaultValue, required }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={id}
      rows={4}
      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      defaultValue={defaultValue}
      required={required}
    />
  </div>
);

// Data Editor for Additional Option Data
const DataEditor: React.FC<{
  data: Array<{ label: string; value: string; url?: string }>;
  onChange: React.Dispatch<React.SetStateAction<{ label: string; value: string; url?: string }[]>>;
}> = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([...data, { label: '', value: '', url: '' }]);
  };

  const handleEdit = (index: number, key: string, value: string) => {
    onChange(data.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleRearrange = (index: number, direction: 'up' | 'down') => {
    onChange(prev => {
      const newData = [...prev];
      const [movedItem] = newData.splice(index, 1);
      newData.splice(direction === 'up' ? index - 1 : index + 1, 0, movedItem);
      return newData;
    });
  };

  return (
    <div className="space-y-4 bg-white mb-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            value={item.label}
            onChange={(e) => handleEdit(index, 'label', e.target.value)}
            placeholder="Label"
            className="bg-white w-1/4 px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => handleEdit(index, 'value', e.target.value)}
            placeholder="Value"
            className="bg-white w-1/4 px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            value={item.url}
            onChange={(e) => handleEdit(index, 'url', e.target.value)}
            placeholder="URL"
            className="bg-white w-1/4 px-3 py-2 border rounded-md"
          />
          <button type="button" onClick={() => handleDelete(index)} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Delete
          </button>
          <button type="button" onClick={() => handleRearrange(index, 'up')} disabled={index === 0} className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50">
            Up
          </button>
          <button type="button" onClick={() => handleRearrange(index, 'down')} disabled={index === data.length - 1} className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50">
            Down
          </button>
        </div>
      ))}
      <div className="flex justify-end">
        <button type="button" onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
          Add New
        </button>
      </div>
    </div>
  );
};
