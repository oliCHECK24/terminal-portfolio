// components/DataEditor.tsx
import React from 'react';

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

export default DataEditor;
