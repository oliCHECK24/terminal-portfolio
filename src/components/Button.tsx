import React from 'react';

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'danger';
}> = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-md text-white';
  const variantClasses = variant === 'danger' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} hover:opacity-90`}
    >
      {children}
    </button>
  );
};

export default Button;
