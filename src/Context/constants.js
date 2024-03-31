import TripCompanion from "../artifacts/contracts/TripCompanion.sol/TripCompanion.json";

export const TripCompanionAddress =
  "0x73dccbc4Ec913Dc1DaE1acD01D08b1Faa82f867E";
export const TripCompanionABI = TripCompanion.abi;

export const ChainId = {
  MAINNET: 1,
  GOERLI: 5,
  POLYGON_MUMBAI: 80001,
  POLYGON_MAINNET: 137,
  SCROLL: 534353,
  OP_AVAIL_SEPOLIA: 202402021700,
};

export let activeChainId = ChainId.OP_AVAIL_SEPOLIA;
export const supportedChains = [
  ChainId.GOERLI,
  ChainId.POLYGON_MAINNET,
  ChainId.POLYGON_MUMBAI,
  ChainId.SCROLL,
  ChainId.OP_AVAIL_SEPOLIA,
];
