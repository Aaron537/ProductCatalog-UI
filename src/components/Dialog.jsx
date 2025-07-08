export default function Dialog({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}