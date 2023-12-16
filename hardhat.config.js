require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { PRIVATE_KET, API_URL } = process.env
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

