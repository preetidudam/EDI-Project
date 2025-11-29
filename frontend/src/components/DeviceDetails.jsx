const DeviceDetails = ({ device }) => {
  if (!device) {
    return (
      <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 text-slate-400">
        Enter a device ID to view the details.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Device Details</h3>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-slate-400">Device ID</dt>
          <dd className="font-mono break-all">{device.deviceId}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Name</dt>
          <dd className="text-slate-100">{device.name}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Owner</dt>
          <dd className="font-mono break-all">{device.owner}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Registered</dt>
          <dd>{new Date(Number(device.timestamp) * 1000).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
};

export default DeviceDetails;



