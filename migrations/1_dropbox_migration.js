const Dropbox = artifacts.require("Dropbox");

module.exports = function (deployer) {
  deployer.deploy(Dropbox);
};
