const DeviceList = ({ devices, onDeviceIdClick }) => {
  if (!devices?.length) {
    return (
      <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 text-slate-400">
        Click "Load My Devices" to fetch everything stored on-chain.
      </div>
    );
  }

  const formatDate = (timestamp) =>
    new Date(Number(timestamp) * 1000).toLocaleString();

  const handleCopy = (deviceId, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(deviceId);
    alert("Device ID copied to clipboard!");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {devices.map((device) => (
        <article
          key={device.deviceId}
          className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 space-y-2 hover:border-teal-400/50 transition cursor-pointer"
          onClick={() => onDeviceIdClick && onDeviceIdClick(device.deviceId)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-mono break-all text-teal-300 flex-1">
              {device.deviceId}
            </div>
            <button
              onClick={(e) => handleCopy(device.deviceId, e)}
              className="text-xs px-2 py-1 bg-teal-400/20 text-teal-300 rounded hover:bg-teal-400/30 transition flex-shrink-0"
              title="Copy Device ID"
            >
              Copy
            </button>
          </div>
          <h4 className="text-lg font-semibold text-slate-100">{device.name}</h4>
          <p className="text-xs text-slate-400 break-all">Owner: {device.owner}</p>
          <p className="text-xs text-slate-500">Registered: {formatDate(device.timestamp)}</p>
          <p className="text-xs text-teal-400/70 mt-2">💡 Click card to fetch details</p>
        </article>
      ))}
    </div>
  );
};

export default DeviceList;





