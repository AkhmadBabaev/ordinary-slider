/* eslint-disable no-console */
const chalk = require('chalk');

const complitionLogHook = () => {
  console.clear();
  console.log(chalk.yellow('Compilation in progress...\n'));
};

const projectInfoHook = ({ projectName, localUrl, url }) => {
  const name = {
    content: projectName || 'not found',
    color: projectName ? 'green' : 'red',
  };

  const network = {
    content: localUrl || 'not found',
    color: localUrl ? 'blue' : 'red',
  };

  console.clear();
  console.log();
  console.log(`Name:                ${chalk[name.color](name.content)}`);
  console.log();
  console.log(`Local:               ${chalk.blue(url)}`);
  console.log(`Network:             ${chalk[network.color](network.content)}`);
  console.log();
};

module.exports = {
  complitionLogHook,
  projectInfoHook,
};
