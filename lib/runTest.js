'use strict';
/**
 * runTest
 * 执行答案测试
 *
 * @author longyiyiyu
 *
 */

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const shelljs = require('shelljs');
const ejs = require('ejs');

const cfg = require('./config');
const utils = require('./utils');

function getAssetsPath(fileName) {
  return path.join(__dirname, 'assets/run', fileName);
}

/*
 * babel 编译问题和答案
 * @params {String} pwd 编译的当前路径，应该是 {root}/quizzes/quiz1/answers/{userName}/
 * 
 */
function compile(pwd) {
  // 准备目录
  shelljs.cd(pwd);
  shelljs.rm('-rf', `./${cfg.TMPDIRNAME}`);
  shelljs.mkdir(cfg.TMPDIRNAME);
  shelljs.mkdir(`${cfg.TMPDIRNAME}/${cfg.TMPQUESTIONDIR}`);
  shelljs.mkdir(`${cfg.TMPDIRNAME}/${cfg.TMPANSWERDIR}`);

  // 编译问题
  const questionDirPath = path.join(pwd, `../../${cfg.QUESTIONDIRNAME}`);
  utils.walkDirs(questionDirPath, dir => {
    utils.babelTransform(
      path.join(questionDirPath, dir),
      path.join(pwd, cfg.TMPDIRNAME, cfg.TMPQUESTIONDIR, dir)
    );
  });

  // 编译答案
  utils.walkDirs(pwd, dir => {
    utils.babelTransform(
      path.join(pwd, dir),
      path.join(pwd, cfg.TMPDIRNAME, cfg.TMPANSWERDIR, dir)
    );
  });
}

/*
 *
 * @params {String} pwd 编译的当前路径，应该是 {root}/quizzes/quiz1/answers/{userName}/
 * @params {String} type 难度类型
 * 
 */
function run(pwd, type) {
  // 检测是否有自定义测试用例
  const customTestFilePath = path.join(
    pwd,
    cfg.TMPDIRNAME,
    cfg.TMPANSWERDIR,
    type,
    cfg.CUSTOMTESTFILENAME
  );
  const hasCustomTest = fs.existsSync(customTestFilePath);

  const mainFilePath = path.join(pwd, cfg.TMPDIRNAME, 'main.js');
  utils.genEJSFile({
    src: getAssetsPath('main.ejs'),
    data: {
      type,
      hasCustomTest
    },
    dist: mainFilePath,
    errMsgPrefix: `generate main file [${mainFilePath}] err:`,
    exitCode: cfg.EXITCODE.BUILDTESTMAINERR
  });

  const questionConfigPath = path.join(
    pwd,
    '../..',
    cfg.QUESTIONDIRNAME,
    cfg.QUESTIONCONFIGFILENAME
  );
  const questionConfig = require(questionConfigPath);
  const { statement, branch, _function } = questionConfig.coverage;

  shelljs.cd(pwd);
  shelljs.exec(
    `node ../../../../node_modules/istanbul/lib/cli cover ../../../../node_modules/mocha/bin/_mocha -- ./${
      cfg.TMPDIRNAME
    }/main.js && node ../../../../node_modules/istanbul/lib/cli check-coverage --statement ${statement} --branch ${branch} --function ${_function}`
  );
}

/**
 * 前面已经检查过环境和参数了
 * 这里就不需要再检查了
 */
function runTest(id, userName, type) {
  const pwd = process.cwd();

  const root = utils.findTheRootPath(pwd);
  const quizDir = path.join(
    root,
    cfg.ALLQUIZZESDIRNAME,
    `${cfg.QUIZDIRNAMEPREFIX}${id}`
  );
  const quizAnswersDir = path.join(quizDir, cfg.ALLANSWERSDIRNAME);
  //   const quizQuestionDir = path.join(quizDir, cfg.QUESTIONDIRNAME);
  const userAnswerDir = path.join(quizAnswersDir, userName);

  compile(userAnswerDir);
  run(userAnswerDir, type);
}

module.exports = runTest;
