'use client';

export default function InputField({ label, name, type = 'text', register, errors, placeholder, className = '', required = false, darkMode = false, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#1A73FF]' : 'text-secondary-700'}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        {...register(name, { required: required ? `${label || name} is required` : false })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${darkMode
            ? `bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 ${errors?.[name] ? 'border-red-500' : ''}`
            : `bg-white text-secondary-900 placeholder-gray-400 ${errors?.[name] ? 'border-red-500' : 'border-gray-300'}`
          } ${className}`}
        {...props}
      />
      {errors?.[name] && (
        <p className={`mt-1 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors[name].message}</p>
      )}
    </div>
  );
}




