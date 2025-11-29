import { useState } from "react";
import "./App.css";
import ConnectWalletButton from "./components/ConnectWalletButton";
import RegisterDeviceForm from "./components/RegisterDeviceForm";
import DeviceDetails from "./components/DeviceDetails";
import DeviceList from "./components/DeviceList";
import Notifications from "./components/Notifications";
import useDeviceRegistry from "./hooks/useDeviceRegistry";

function App() {
  const {
    account,
    connectWallet,
    registerDevice,
    fetchDeviceById,
    loadMyDevices,
    myDevices,
    selectedDevice,
    notification,
    pushNotification,
    clearNotification,
    loading,
    computeDeviceId,
    isContractConfigured,
  } = useDeviceRegistry();

  const [deviceIdInput, setDeviceIdInput] = useState("");

  const handleRegister = async (name) => {
    try {
      const id = await registerDevice(name);
      pushNotification("success", "Device registered successfully.");
      return id;
    } catch (error) {
      pushNotification("error", error.message);
      throw error;
    }
  };

  const handleFetchDetails = async () => {
    if (!deviceIdInput) return;
    try {
      await fetchDeviceById(deviceIdInput);
      pushNotification("success", "Device fetched successfully.");
    } catch (error) {
      pushNotification("error", error.message);
    }
  };

  const handleLoadDevices = async () => {
    try {
      await loadMyDevices();
      pushNotification("success", "Loaded all your devices.");
    } catch (error) {
      pushNotification("error", error.message);
    }
  };

  return (
    <main className="App container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-10 space-y-3 text-center">
        <p className="uppercase tracking-[0.3em] text-sm text-teal-300">
          DID-IoT Registry
        </p>
        <h1 className="text-4xl font-bold">
          Decentralized IoT Device Identity
        </h1>
        <p className="text-slate-400">
          Register unlimited devices, fetch by ID, and view ownership history
          without trusting a traditional database.
        </p>
      </header>

      <section className="space-y-6">
        <ConnectWalletButton
          account={account}
          onConnect={async () => {
            try {
              await connectWallet();
            } catch (error) {
              pushNotification("error", error.message);
            }
          }}
          isContractReady={isContractConfigured}
        />

        <RegisterDeviceForm
          onRegister={handleRegister}
          loading={loading}
          account={account}
          computeDeviceId={computeDeviceId}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-semibold">Fetch Device by ID</h2>
            <input
              type="text"
              placeholder="Paste deviceId (bytes32 hex)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={deviceIdInput}
              onChange={(event) => setDeviceIdInput(event.target.value)}
              disabled={!account}
            />
            <button
              onClick={handleFetchDetails}
              disabled={!account || !deviceIdInput}
              className="w-full px-4 py-2 rounded-xl bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 disabled:bg-slate-600 disabled:text-slate-400 transition"
            >
              Fetch Details
            </button>
          </div>
          <DeviceDetails device={selectedDevice} />
        </div>

        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">All My Devices</h2>
              <p className="text-sm text-slate-400">
                Load every device registered by the currently connected wallet.
              </p>
            </div>
            <button
              onClick={handleLoadDevices}
              disabled={!account || loading}
              className="px-4 py-2 rounded-xl bg-transparent border border-teal-400 text-teal-300 font-semibold hover:bg-teal-400/10 disabled:border-slate-700 disabled:text-slate-500 transition"
            >
              {loading ? "Loading..." : "Load My Devices"}
            </button>
          </div>
          <DeviceList devices={myDevices} />
        </div>

        <Notifications
          notification={notification}
          onClose={clearNotification}
        />
      </section>
    </main>
  );
}

export default App;
