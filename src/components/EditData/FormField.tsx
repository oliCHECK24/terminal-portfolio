// components/FormField.tsx
import React from 'react';

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

export default FormField;
