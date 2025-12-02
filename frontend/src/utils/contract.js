import DeviceRegistryArtifact from "../abi/DeviceRegistry.json";

export const CONTRACT_ADDRESS =
  process.env.REACT_APP_DEVICE_REGISTRY_ADDRESS ??
  "0x0000000000000000000000000000000000000000";

export const DEVICE_REGISTRY_ABI = DeviceRegistryArtifact.abi;





