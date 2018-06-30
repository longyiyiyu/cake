'use strict';
/**
 * config
 * 配置信息
 *
 * @author longyiyiyu
 *
 */

module.exports = {
  PROJ_NAME: 'cakeq',
  ALLQUIZZESDIRNAME: 'quizzes',
  QUIZDIRNAMEPREFIX: 'quiz',
  ALLANSWERSDIRNAME: 'answers',
  QUESTIONDIRNAME: 'question',
  QUESTIONMAIN: 'cake.js',
  ANSWERMAIN: 'ans.js',
  BASE: 'base',
  ADVANCEPREFIX: 'advance',
  TMPDIRNAME: 'tmp',
  TMPQUESTIONDIR: 'q',
  TMPANSWERDIR: 'a',
  CUSTOMTESTFILENAME: 'test.js',
  QUESTIONCONFIGFILENAME: 'cake.json',
  EXITCODE: {
    // 1xxx - 环境问题
    NOTINPROJECT: 1001,
    NOGIT: 1002,
    NOGITNAME: 1003,

    // 2xxx - 用户输入问题
    INVALIDID: 2001,
    INPUTIDFAIL: 2002,
    HAVEANSWER: 2003,
    NOUSERNAME: 2004,
    USERHAVENOTANSWER: 2005,
    NOTYPE: 2005,

    // 3xxx - cli 自身问题
    BUILDANSWERMAINERR: 3001,
    BUILDANSWERPKGERR: 3002,
    BUILDTESTMAINERR: 3003,
  }
};
