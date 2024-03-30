import TripCompanion from "../artifacts/contracts/TripCompanion.sol/TripCompanion.json";

export const TripCompanionAddress =
  "0xCF5a81C26Fd5cE793A947f8fC7127675c31698E7";
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
