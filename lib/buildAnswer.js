'use strict';
/**
 * buildAnswer
 * 创建 answer 环境
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
  return path.join(__dirname, 'assets/answer', fileName);
}

/**
 * 前面已经检查过环境和参数了
 * 这里就不需要再检查了
 */
function buildAnswer(id, userName) {
  const pwd = process.cwd();

  const root = utils.findTheRootPath(pwd);
  const quizDir = path.join(
    root,
    cfg.ALLQUIZZESDIRNAME,
    `${cfg.QUIZDIRNAMEPREFIX}${id}`
  );
  const quizAnswersDir = path.join(quizDir, cfg.ALLANSWERSDIRNAME);
  const quizQuestionDir = path.join(quizDir, cfg.QUESTIONDIRNAME);
  const userAnswerDir = path.join(quizAnswersDir, userName);

  shelljs.mkdir(userAnswerDir);
  const questionFileList = shelljs.ls(quizQuestionDir).toString();
  questionFileList.split(',').forEach(dir => {
    if (dir === cfg.BASE || dir.startsWith(cfg.ADVANCEPREFIX)) {
      const targetQuestionFile = path.join(
        quizQuestionDir,
        dir,
        cfg.QUESTIONMAIN
      );
      const argsList = utils.getQuestionArgsList(targetQuestionFile);
      const targetDir = path.join(userAnswerDir, dir);

      shelljs.mkdir(targetDir);

      // 生成 main 文件
      const mainFilePath = path.join(targetDir, cfg.ANSWERMAIN);
      utils.genEJSFile({
        src: getAssetsPath('ans.ejs'),
        data: {
          argsList
        },
        dist: mainFilePath,
        errMsgPrefix: `generate main file [${mainFilePath}] err:`,
        exitCode: cfg.EXITCODE.BUILDANSWERMAINERR
      });
    }

    // 生成 package.json
    const pkgFilePath = path.join(userAnswerDir, 'package.json');
    utils.genEJSFile({
      src: getAssetsPath('package_json.ejs'),
      data: {
        id,
        userName
      },
      dist: pkgFilePath,
      errMsgPrefix: `generate package.json file [${pkgFilePath}] err:`,
      exitCode: cfg.EXITCODE.BUILDANSWERPKGERR
    });
  });
}

module.exports = buildAnswer;
