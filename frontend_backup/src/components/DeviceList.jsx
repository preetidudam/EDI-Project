const DeviceList = ({ devices }) => {
  if (!devices?.length) {
    return (
      <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 text-slate-400">
        Click "Load My Devices" to fetch everything stored on-chain.
      </div>
    );
  }

  const formatDate = (timestamp) =>
    new Date(Number(timestamp) * 1000).toLocaleString();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {devices.map((device) => (
        <article
          key={device.deviceId}
          className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 space-y-2"
        >
          <div className="text-xs font-mono break-all text-teal-300">{device.deviceId}</div>
          <h4 className="text-lg font-semibold text-slate-100">{device.name}</h4>
          <p className="text-xs text-slate-400 break-all">{device.owner}</p>
          <p className="text-xs text-slate-500">{formatDate(device.timestamp)}</p>
        </article>
      ))}
    </div>
  );
};

export default DeviceList;



