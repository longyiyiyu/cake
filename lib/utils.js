'use strict';
/**
 * utils
 * cake-cli 的 utils
 *
 * @author longyiyiyu
 *
 */

const fs = require('fs');
const path = require('path');

const shelljs = require('shelljs');
const babel = require('babel-core');
const ejs = require('ejs');

const cfg = require('./config');

/**
 * 检查是否在 cake 项目里面
 * 判断是在一个叫 cake.git 的 git 项目即可
 * 不会有人专门来恶心项目吧，没意义
 * @returns {Boolean} 是否在 cake 项目里面
 */
function checkIsInProject() {
  return /\/cake\.git/.test(
    shelljs.exec('git remote -v', { silent: true }).toString()
  );
}

/**
 * 找到 cake 项目的根目录路径
 * @param {String} p 路径
 */
function findTheRootPath(p) {
  if (path.dirname(p) === p) {
    return '';
  }

  const pkgFilePath = path.join(p, 'package.json');
  if (fs.existsSync(pkgFilePath)) {
    const pkg = require(pkgFilePath);
    if (pkg.name === cfg.PROJ_NAME && fs.existsSync(path.join(p, '.git'))) {
      return p;
    }
  }

  return findTheRootPath(path.dirname(p));
}

/**
 * 检查题目 ID 是否合法
 * 有相应的题目才算合法
 * @param {Number} id 题目id
 * @returns {Boolean} 是否合法
 */
function isValidQuestionID(id) {
  const root = findTheRootPath(process.cwd());

  if (!root) {
    return false;
  }

  const targetPath = path.join(
    root,
    cfg.ALLQUIZZESDIRNAME,
    `${cfg.QUIZDIRNAMEPREFIX}${id}`
  );

  return fs.existsSync(targetPath);
}

/**
 * 从 pwd 获取题目 ID
 * @returns {String} 题目id，如果没有返回''
 */
function getQuestionIDFromPWD() {
  const reg = new RegExp(
    `${path.sep}${cfg.ALLQUIZZESDIRNAME}${path.sep}${
      cfg.QUIZDIRNAMEPREFIX
    }(\\d+)`
  );
  const m = process.cwd().match(reg);

  if (!m) {
    return '';
  } else {
    return m[1];
  }
}

/**
 * 获取用户名
 */
function getUserName() {
  return shelljs
    .exec('git config --get user.name', {
      silent: true
    })
    .toString()
    .trim();
}

/**
 * 检查该题目下该用户是否已经有答案
 * 注意：本方法不检查环境，前面必须有保证！
 * @param {String} id 题目id
 * @param {String} userName 用户名
 * @returns {Boolean} 是否已经有答案
 */
function hasAnswerFromUser(id, userName) {
  const root = findTheRootPath(process.cwd());
  const targetPath = path.join(
    root,
    cfg.ALLQUIZZESDIRNAME,
    `${cfg.QUIZDIRNAMEPREFIX}${id}`,
    cfg.ALLANSWERSDIRNAME,
    userName
  );

  return fs.existsSync(targetPath);
}

function getQuestionArgsList(questionFile) {
  return fs
    .readFileSync(questionFile, 'utf8')
    .match(/function test\(([^)]*)\) {/)[1]
    .split(/, ?/);
}

/**
 * 题目是否有对应难度
 * @param {String} id 题目 id
 * @param {String} type 题目难度
 */
function hasQuestionType(id, type) {
  const root = findTheRootPath(process.cwd());

  if (!root) {
    return false;
  }

  const targetPath = path.join(
    root,
    cfg.ALLQUIZZESDIRNAME,
    `${cfg.QUIZDIRNAMEPREFIX}${id}`,
    cfg.QUESTIONDIRNAME,
    type
  );

  return fs.existsSync(targetPath);
}

/**
 * 遍历文件夹，获取 base 和 advance 文件夹
 * @param {String} dir 问题文件夹路径
 * @param {String} cb 回调
 */
function walkDirs(dir, cb) {
  fs.readdirSync(dir).forEach(file => {
    const stats = fs.statSync(path.join(dir, file));

    if (
      file === cfg.BASE ||
      (file.startsWith(cfg.ADVANCEPREFIX) && stats.isDirectory())
    ) {
      cb(file);
    }
  });
}

/**
 * babel 编译
 * @param {String} src 源文件路径
 * @param {String} dist 目标文件路径
 * @param {Object} options 配置
 */
function babelTransform(src, dist, options = {}) {
  const stats = fs.statSync(src);
  if (stats.isFile()) {
    fs.writeFileSync(dist, babel.transformFileSync(src, options).code);
  } else if (stats.isDirectory()) {
    shelljs.mkdir(dist);
    fs.readdirSync(src).forEach(file => {
      babelTransform(path.join(src, file), path.join(dist, file), options);
    });
  }
}

/**
 * 通过 ejs 生成文件
 * @param {String} src ejs file 源文件
 * @param {Object} data 数据
 * @param {String} dist 目标路径
 * @param {String} errMsgPrefix ejs 生成失败时的提示文案
 * @param {String} exitCode ejs 生成失败时程序退出错误码
 */
function genEJSFile({ src, data, dist, errMsgPrefix, exitCode }) {
  ejs.renderFile(src, data, null, (err, str) => {
    if (err) {
      console.log(chalk.red(`${errMsgPrefix} ${JSON.stringify(err)}`));
      process.exit(exitCode);
    }

    fs.writeFileSync(dist, str);
  });
}

module.exports = {
  checkIsInProject,
  isValidQuestionID,
  getQuestionIDFromPWD,
  getUserName,
  hasAnswerFromUser,
  findTheRootPath,
  getQuestionArgsList,
  hasQuestionType,
  walkDirs,
  babelTransform,
  genEJSFile
};
