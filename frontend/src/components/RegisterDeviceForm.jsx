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
        <div className="mt-4 text-xs text-teal-300 break-all">
          Latest Device ID: {lastDeviceId}
        </div>
      )}
    </div>
  );
};

export default RegisterDeviceForm;





