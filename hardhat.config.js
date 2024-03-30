require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: "0.8.17",
		settings: { optimizer: { enabled: true, runs: 200 } },
	},
	paths: {
		artifacts: "./src/artifacts",
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		polygon_mumbai: {
			url: `https://polygon-testnet.public.blastapi.io`,
			accounts: [
				"0xcdc26fe4508d24ddeb1e082e8b637a27898c5bfc330c68b18cab10648eb9061b",
			],
			allowUnlimitedContractSize: true,
		},
		OP_Avail_Sepolia_Testnet: {
			url: "https://op-avail-sepolia.alt.technology",
			chainId: 202402021700,
			accounts: [
				"d78a037d53c4d0bf724f3de20add6d53da42bee3334718dd85708865d3023ce3",
			],
			allowUnlimitedContractSize: true,
		},
	},
};
