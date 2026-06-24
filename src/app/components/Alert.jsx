export default function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };

  return (
    <div
      className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium ${styles[type]}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
    </div>
  );
}
