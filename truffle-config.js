const path = require('path')
const HDWalletProvider = require('@truffle/hdwallet-provider');
require("ts-node").register({
  files: true,
})
const env = require('./env')

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: () => new HDWalletProvider(env.ROPSTEN_PRIVATE_KEY, env.INFURA.ROPSTEN_ENDPOINT),
      network_id: 3,
      //make sure this gas allocation isn't over 4M, which is the max
      gas: 4000000,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
}
