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

const { answer, run } = require('./cake');

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
      verticalLayout: 'default'
    },
    (err, data) => {
      if (err) {
        console.log(chalk.red(`figlet err: ${JSON.stringify(err)}`));
        return;
      }

      console.log(chalk.cyan(data));
      console.log(
        chalk.cyan(
          ` cake，当前版本v${
            pkg.version
          }, 来练练手吧！主页: https://github.com/longyiyiyu/cake`
        )
      );
      console.log(
        chalk.cyan(' Run `cake-cli --help` or `c --help` to see usage.')
      );
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

  program.version(pkg.version, '-v, --version');

  program
    .command('answer [number]')
    .alias('a')
    .description('to answer the question')
    .action(number => {
      number = parseInt(number) || 0;
      answer(number);
    });

  program
    .command('run [number]')
    .alias('r')
    .option('-u --user <userName>', "who's answer")
    .option('-t --type <type>', 'the type of degree')
    .description(
      'to run the answer from [userName] of question [number] with degree [type]'
    )
    .action((number, cmd) => {
      number = parseInt(number) || 0;
      run(number, cmd.user, cmd.type);
    });

  // program
  //   .command('submit')
  //   .alias('s')
  //   .description('to submit the answer')
  //   .action(() => {
  //     // console.log('to submit the answer!');
  //     submit();
  //   });

  program
    .command('*', '', {
      noHelp: true
    })
    .action(() => {
      program.help();
    });

  program.on('--help', () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    # to answer question 1');
    console.log('    $ c a 1');
    console.log('    # to run your answer of question 1 with degree base');
    console.log('    $ c r 1');
    console.log('    # to run answer from Blob of question 1 with degree base');
    console.log('    $ c r 1 -u Blob');
    console.log('    # to run your answer of question 1 with degree advance1');
    console.log('    $ c r 1 -t advance1');
    console.log('');
  });

  program.parse(process.argv);
}

module.exports = main;
