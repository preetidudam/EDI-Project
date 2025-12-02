import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACT_ADDRESS, DEVICE_REGISTRY_ABI } from "../utils/contract";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const useDeviceRegistry = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [myDevices, setMyDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const isContractConfigured = useMemo(() => {
    return CONTRACT_ADDRESS && CONTRACT_ADDRESS !== ZERO_ADDRESS;
  }, []);

  const attachContract = useCallback(async (provider) => {
    if (!isContractConfigured) {
      throw new Error(
        "Contract address not configured. Update REACT_APP_DEVICE_REGISTRY_ADDRESS."
      );
    }

    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, DEVICE_REGISTRY_ABI, signer);
  }, [isContractConfigured]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is required. Please install or enable it.");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      const nextAccount = ethers.getAddress(accounts[0]);
      const registry = await attachContract(provider);

      setAccount(nextAccount);
      setContract(registry);
      setNotification({
        type: "success",
        message: `Connected as ${nextAccount}`,
      });
    } catch (error) {
      if (error.code === 4001) {
        throw new Error("Connection rejected. Please approve the connection request.");
      }
      throw error;
    }
  }, [attachContract]);

  const computeDeviceId = useCallback((owner, deviceName) => {
    if (!owner || !deviceName) return null;
    return ethers.solidityPackedKeccak256(
      ["address", "string"],
      [owner, deviceName]
    );
  }, []);

  const registerDevice = useCallback(
    async (deviceName) => {
      if (!contract) {
        throw new Error("Connect your wallet before registering.");
      }
      if (!deviceName) {
        throw new Error("Device name cannot be empty.");
      }

      setLoading(true);
      try {
        const tx = await contract.registerDevice(deviceName);
        const receipt = await tx.wait();
        
        // Parse events using ethers v6 contract interface
        let deviceId = null;
        if (receipt && receipt.logs) {
          try {
            // Use contract interface to parse logs
            const contractInterface = contract.interface;
            for (const log of receipt.logs) {
              try {
                const parsedLog = contractInterface.parseLog(log);
                if (parsedLog && parsedLog.name === "DeviceRegistered") {
                  deviceId = parsedLog.args.deviceId;
                  break;
                }
              } catch (e) {
                // Not a DeviceRegistered event, continue
                continue;
              }
            }
          } catch (e) {
            console.warn("Could not parse events from receipt:", e);
          }
        }
        
        // Fallback to computed deviceId if event parsing failed
        if (!deviceId) {
          deviceId = computeDeviceId(account, deviceName);
        }

        setNotification({
          type: "success",
          message: `Device "${deviceName}" registered.`,
        });

        return deviceId;
      } catch (error) {
        console.error(error);
        let errorMessage = "Failed to register device.";
        
        // Extract error message from various possible formats
        const errorString = error.reason || error.shortMessage || error.message || String(error);
        
        // User-friendly error messages
        if (errorString.includes("Device already exists") || errorString.includes("already exists")) {
          errorMessage = "This device is already registered. Each device name can only be registered once per wallet.";
        } else if (errorString.includes("Device name required") || errorString.includes("name required")) {
          errorMessage = "Please enter a device name.";
        } else if (errorString.includes("user rejected") || errorString.includes("User denied")) {
          errorMessage = "Transaction was cancelled. Please try again.";
        } else if (errorString.includes("insufficient funds") || errorString.includes("insufficient balance")) {
          errorMessage = "Insufficient funds. Please add more ETH to your wallet.";
        } else if (errorString.includes("nonce") || errorString.includes("replacement")) {
          errorMessage = "Transaction error. Please try again in a moment.";
        } else if (errorString) {
          // Use the error message but make it more user-friendly
          errorMessage = errorString.replace(/^Error: /, "").replace(/execution reverted: /, "");
        }
        
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [account, computeDeviceId, contract]
  );

  const fetchDeviceById = useCallback(
    async (deviceId) => {
      if (!contract) {
        throw new Error("Connect your wallet first.");
      }

      try {
        const device = await contract.getDeviceDetails(deviceId);
        setSelectedDevice(device);
        return device;
      } catch (error) {
        console.error(error);
        throw new Error("Device not found. Check the ID and try again.");
      }
    },
    [contract]
  );

  const loadMyDevices = useCallback(async () => {
    if (!contract) {
      throw new Error("Connect your wallet first.");
    }

    setLoading(true);
    try {
      const devices = await contract.getAllMyDevices();
      setMyDevices(devices);
      return devices;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to load devices. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const pushNotification = useCallback(
    (type, message) => setNotification({ type, message }),
    []
  );

  const clearNotification = useCallback(() => setNotification(null), []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handler = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
        setMyDevices([]);
        setSelectedDevice(null);
      } else {
        try {
          const newAccount = ethers.getAddress(accounts[0]);
          setAccount(newAccount);
          
          // Re-attach contract with new account
          if (isContractConfigured) {
            const provider = new BrowserProvider(window.ethereum);
            const registry = await attachContract(provider);
            setContract(registry);
          }
        } catch (error) {
          console.error("Error handling account change:", error);
          setNotification({
            type: "error",
            message: "Failed to reconnect after account change.",
          });
        }
      }
    };

    window.ethereum.on("accountsChanged", handler);
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handler);
      }
    };
  }, [isContractConfigured, attachContract]);

  return {
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
  };
};

export default useDeviceRegistry;

