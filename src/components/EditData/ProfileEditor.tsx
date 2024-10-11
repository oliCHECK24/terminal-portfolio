// components/ProfileEditor.tsx
'use client';
import { adaptUsername, getData, saveData } from '@/actions/api';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import EditForm from './EditForm';
import OptionView from './OptionView';

// Define the structure of an option
export interface Option {
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

    let newOptions = [...options];
    const newOptionData = {
      label: target.label.value,
      about: target.about.value,
      value: target.value.value,
      data: updatedData,
      editing: false,
    };

    if (isNew) {
      newOptions = [...options, newOptionData];
      setIsAddingNew(false);
    } else if (index !== undefined) {
      newOptions[index] = newOptionData;
    }
    setOptions(newOptions);

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
              option={{ label: '', about: '', value: '', data: [] }}
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
