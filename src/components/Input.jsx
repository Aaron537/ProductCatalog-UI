export default function Input({ name, value, onChange, error, placeholder, className = '' }) {
  return (
    <div className="space-y-1">
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}