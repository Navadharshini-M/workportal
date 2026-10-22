export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmClass = 'btn-primary' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="px-6 py-5">
          <h3 className="text-base font-semibold text-brand-text mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-brand-border">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={confirmClass}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
