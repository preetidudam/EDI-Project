import { useState } from "react";

const RegisterDeviceForm = ({ onRegister, loading, account, computeDeviceId }) => {
  const [deviceName, setDeviceName] = useState("");
  const [lastDeviceId, setLastDeviceId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!deviceName.trim()) return;

    const id = await onRegister(deviceName.trim());
    setLastDeviceId(id);
    setDeviceName("");
  };

  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Register Device</h2>
          <p className="text-sm text-slate-400">Device IDs are computed deterministically with keccak256(owner, name).</p>
        </div>
        {account && deviceName && (
          <div className="text-xs text-slate-400 w-48 truncate">
            Preview ID: {computeDeviceId(account, deviceName)}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter device name (e.g., Weather Sensor)"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          disabled={!account || loading}
        />
        <button
          type="submit"
          disabled={!account || loading || !deviceName.trim()}
          className="px-4 py-2 rounded-xl bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 disabled:bg-slate-600 disabled:text-slate-400 transition"
        >
          {loading ? "Registering..." : "Register Device"}
        </button>
      </form>

      {lastDeviceId && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-teal-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-300">Latest Device ID:</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(lastDeviceId);
                alert("Device ID copied to clipboard!");
              }}
              className="text-xs px-2 py-1 bg-teal-400/20 text-teal-300 rounded hover:bg-teal-400/30 transition"
            >
              Copy
            </button>
          </div>
          <div className="text-xs text-teal-200 break-all font-mono">
            {lastDeviceId}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            💡 Save this ID to fetch device details later, or use "Load My Devices" to see all your device IDs.
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterDeviceForm;





