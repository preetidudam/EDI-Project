const ConnectWalletButton = ({ account, onConnect, isContractReady }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 flex flex-col gap-3">
      <p className="text-sm text-slate-300">
        {isContractReady
          ? "Connect MetaMask to start managing your IoT devices."
          : "Set REACT_APP_DEVICE_REGISTRY_ADDRESS in .env before connecting."}
      </p>
      <button
        disabled={!isContractReady}
        onClick={onConnect}
        className="px-4 py-2 rounded-xl bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 disabled:bg-slate-600 disabled:text-slate-400 transition"
      >
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
      </button>
    </div>
  );
};

export default ConnectWalletButton;



