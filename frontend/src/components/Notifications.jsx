const Notifications = ({ notification, onClose }) => {
  if (!notification) return null;

  const colors =
    notification.type === "error"
      ? "bg-rose-500/20 border border-rose-400 text-rose-100"
      : "bg-emerald-500/20 border border-emerald-400 text-emerald-100";

  return (
    <div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${colors}`}>
      <span className="text-sm">{notification.message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-xs uppercase tracking-wide hover:underline"
      >
        Close
      </button>
    </div>
  );
};

export default Notifications;





