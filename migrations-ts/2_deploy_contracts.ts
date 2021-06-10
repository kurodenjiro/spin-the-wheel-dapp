const Casino = artifacts.require('Casino')

const migration: Truffle.Migration = function (deployer) {
  deployer.deploy(Casino)
}
module.exports = migration
export { }
