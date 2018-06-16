'use strict';
/**
 * cake-cli
 * cake 系统的命令行工具
 *
 * @author longyiyiyu
 *
 */

const pkg = require('../package.json');
const figlet = require('figlet');
const chalk = require('chalk');
const semver = require('semver');

const program = require('commander');

const cake = require('./cake');

/**
 * Print banner
 * Font preview：http://patorjk.com/software/taag/#p=display&f=3D-ASCII&t=feflow%0A
 *
 */
function printBanner() {
  figlet.text(
    'CAKE',
    {
      font: '3D-ASCII',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    },
    (err, data) => {
      if (err) {
        console.log(chalk.red(`figlet err: ${JSON.stringify(err)}`));
        return;
      }

      console.log(chalk.cyan(data));
      console.log(chalk.cyan(` cake，当前版本v${pkg.version}, 来练练手吧！主页: https://github.com/longyiyiyu/cake`));
      // console.log(chalk.cyan(' (c) powered by IMWeb Team'));
      console.log(chalk.cyan(' Run `cake-cli --help` or `c --help` to see usage.'));
    }
  );
}

function checkNodeVersion() {
  if (!semver.satisfies(process.version, pkg.engines.node)) {
    console.log(
      chalk.red(
        `运行 cake 所需 Node.js 版本为: ${pkg.engines.node}，当前版本为: ${
          process.version
        }，请升级到最新版本 Node.js(https://nodejs.org/en/).`
      )
    );

    return false;
  }

  return true;
}

function main() {
  // 检查 node 版本
  if (!checkNodeVersion()) {
    return;
  }

  if (process.argv.length <= 2) {
    return printBanner();
  }

  // console.log('process.argv:', process.argv, process.cwd(), process.execPath, __dirname);

  program.version(pkg.version, '-v, --version');

  program
    .command('answer [number]')
    .alias('a')
    .description('to answer the question')
    .action((number) => {
      number = parseInt(number) || 0;
      // console.log(`answer: [${qNum}]`);
      cake.answer(number);
    });

  program
    .command('submit')
    .alias('s')
    .description('to submit the answer')
    .action(() => {
      // console.log('to submit the answer!');
      cake.submit();
    });

  program
    .command('*', '', {
      noHelp: true,
    })
    .action(() => {
      program.help();
    });

  program.on('--help', () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ c --help');
    console.log('    $ c -h');
    console.log('    $ c a 1');
    console.log('    $ c s');
    console.log('');
  });

  program.parse(process.argv);
}

module.exports = main;
