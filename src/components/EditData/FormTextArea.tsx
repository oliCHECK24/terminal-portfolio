// components/FormTextArea.tsx
import React from 'react';

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

export default FormTextArea;
