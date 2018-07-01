'use strict';
/**
 * cake
 * cake-cli 工具核心
 *
 * @author longyiyiyu
 *
 */

const chalk = require('chalk');
const shelljs = require('shelljs');
const prompt = require('prompt');

const pkg = require('../package.json');
const cfg = require('./config');
const utils = require('./utils');

const buildAnswer = require('./buildAnswer');
const runTest = require('./runTest');

/**
 * 检查 git 环境
 */
function checkGit() {
  if (!shelljs.which('git')) {
    console.log(chalk.red('need git!'));
    process.exit(cfg.EXITCODE.NOGIT);
  }
}

/**
 * 检查是否在 cake 项目里面
 */
function checkIsInProject() {
  const pwd = process.cwd();
  // 检查是否在 cake 项目内
  if (!utils.checkIsInProject(pwd)) {
    console.log(chalk.red(`you are not in cake project, pwd: [${chalk.green(pwd)}].`));
    process.exit(cfg.EXITCODE.NOTINPROJECT);
  }
}

/**
 * 获取题目id
 * @param {String} qNum 题目id
 */
function getQuestionNumber(qNum) {
  // 用户输入了题目 ID
  if (qNum) {
    // ID 非法
    if (!utils.isValidQuestionID(qNum)) {
      console.log(chalk.red(`ID [${chalk.green(qNum)}] is invalid!`));
      process.exit(cfg.EXITCODE.INVALIDID);
    }

    return Promise.resolve(qNum);
  } else {
    qNum = utils.getQuestionIDFromPWD();

    // 用户当前处于某道题目中
    if (qNum) {
      return Promise.resolve(qNum);
    } else {
      // 询问用户，让用户输入题目 ID
      return new Promise((resolve) => {
        prompt.message = prompt.delimiter = '';
        prompt.start();
        prompt.get(
          {
            properties: {
              id: {
                type: 'integer',
                description: 'input question number:',
                message: 'id is invalid!',
                required: true,
                conform: (value) => {
                  value = parseInt(value);

                  if (!value) {
                    return false;
                  }

                  return utils.isValidQuestionID(value);
                },
              },
            },
          },
          (err, result) => {
            if (err) {
              console.log(chalk.red('input ID failed!'));
              process.exit(cfg.EXITCODE.INPUTIDFAIL);
            }

            resolve(result.id);
          }
        );
      });
    }
  }
}

/**
 * 开始答题
 */
function answer(qNum) {
  checkGit();
  checkIsInProject();

  getQuestionNumber(qNum).then((id) => {
    const userName = utils.getUserName();

    if (!userName) {
      // 没有用户名
      console.log(chalk.red('no git user name!'));
      process.exit(cfg.EXITCODE.NOGITNAME);
    } else if (utils.hasAnswerFromUser(id, userName)) {
      // 该用户已经有答案
      console.log(chalk.red(`you have the answer of question ${id} already!`));
      process.exit(cfg.EXITCODE.HAVEANSWER);
    } else {
      buildAnswer(id, userName);
    }
  });
}

/**
 * 测试答案
 */
function run(qNum, userName, type = 'base') {
  checkGit();
  checkIsInProject();

  getQuestionNumber(qNum).then((id) => {
    // 没有传就默认是跑自己的答案
    if (!userName) {
      userName = utils.getUserName();
    }

    if (!userName) {
      // 没有用户名
      console.log(chalk.red('no user name!'));
      process.exit(cfg.EXITCODE.NOUSERNAME);
    } else if (!utils.hasAnswerFromUser(id, userName)) {
      // 该用户没有答案
      console.log(chalk.red(`the user [${userName}] has not the answer of question ${id}!`));
      process.exit(cfg.EXITCODE.USERHAVENOTANSWER);
    } else if (!utils.hasQuestionType(id, type)) {
      // 没有对应的 type
      console.log(chalk.red(`the question ${id} has not the degree [${type}] of difficulty!`));
      process.exit(cfg.EXITCODE.NOTYPE);
    } else {
      runTest(id, userName, type);
    }
  });
}

/**
 * 提交答案
 */
// function submit() {
//   checkGit();
// }

module.exports = {
  answer,
  run,
  // submit,
};
