const Notifications = ({ notification, onClose }) => {
  if (!notification) return null;

  const colors =
    notification.type === "error"
      ? "bg-rose-500/20 border border-rose-400 text-rose-100"
      : "bg-emerald-500/20 border border-emerald-400 text-emerald-100";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down">
      <div className={`rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg ${colors}`}>
        <span className="text-sm">{notification.message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-xs uppercase tracking-wide hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notifications;





