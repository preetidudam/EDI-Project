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
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is required. Please install or enable it.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const nextAccount = ethers.getAddress(accounts[0]);
    const registry = await attachContract(provider);

    setAccount(nextAccount);
    setContract(registry);
    setNotification({
      type: "success",
      message: `Connected as ${nextAccount}`,
    });
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
        const event = receipt.logs.find(
          (log) => log.fragment?.name === "DeviceRegistered"
        );

        const deviceId =
          event?.args?.deviceId ?? computeDeviceId(account, deviceName);

        setNotification({
          type: "success",
          message: `Device "${deviceName}" registered.`,
        });

        return deviceId;
      } catch (error) {
        console.error(error);
        throw new Error(error.shortMessage || error.message);
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

    const handler = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
        setMyDevices([]);
        setSelectedDevice(null);
      } else {
        setAccount(ethers.getAddress(accounts[0]));
      }
    };

    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum?.removeListener("accountsChanged", handler);
  }, []);

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

