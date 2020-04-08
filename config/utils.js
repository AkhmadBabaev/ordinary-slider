/* eslint-disable import/no-extraneous-dependencies */
const ip = require('ip');
const packageJson = require('../package.json');

/**
 * @return {string} network ip address.
 */
function getNetworkIp() {
  const currentIP = ip.address();
  const isPrivate = ip.isPrivate(currentIP);
  const isV4Format = ip.isV4Format(currentIP);

  return isPrivate && isV4Format && currentIP;
}

const projectName = packageJson.name;
const protocol = 'http';
const domain = 'localhost';
const port = 8080;
const networkIp = getNetworkIp();
const url = `${protocol}://${domain}:${port}`;
const localUrl = networkIp && `${protocol}://${networkIp}:${port}`;

module.exports = {
  port,
  url,
  localUrl,
  projectName,
};
